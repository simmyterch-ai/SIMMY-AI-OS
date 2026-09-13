import {
  authRepository,
} from "@/repositories/auth.repository";

import {
  verifyPassword,
  hashPassword,
} from "@/lib/password";

import {
  generateToken,
  AuthScope,
} from "@/lib/jwt";

export class AuthService {
  // =======================================================
  // LOGIN
  // =======================================================

  async login(
    email: string,
    password: string
  ) {
    const user =
      await authRepository.findUserByEmail(
        email
      );

    // -----------------------------------------------------
    // USER MUST EXIST
    // -----------------------------------------------------

    if (!user) {
      throw new Error(
        "Invalid email or password."
      );
    }

    // -----------------------------------------------------
    // PASSWORD MUST EXIST
    // -----------------------------------------------------

    if (!user.passwordHash) {
      throw new Error(
        "This account has no password yet. Please contact your administrator."
      );
    }

    // -----------------------------------------------------
    // VERIFY PASSWORD
    // -----------------------------------------------------

    const validPassword =
      await verifyPassword(
        password,
        user.passwordHash
      );

    if (!validPassword) {
      throw new Error(
        "Invalid email or password."
      );
    }

    // -----------------------------------------------------
    // ACCOUNT MUST BE ACTIVE
    // -----------------------------------------------------

    if (!user.isActive) {
      throw new Error(
        "This account has been disabled."
      );
    }

    // -----------------------------------------------------
    // ROLE MUST EXIST
    // -----------------------------------------------------

    if (!user.role) {
      throw new Error(
        "This account does not have a role assigned."
      );
    }

    const normalizedRole =
      user.role
        .trim()
        .toLowerCase();

    // =====================================================
    // DETERMINE AUTHENTICATION SCOPE
    // =====================================================

    const isSuperAdmin =
      normalizedRole ===
      "super admin";

    let scope: AuthScope;

    // -----------------------------------------------------
    // PLATFORM-LEVEL USER
    // -----------------------------------------------------

    if (isSuperAdmin) {
      /*
       * Super Admin belongs to the SAP PLATFORM,
       * not to any subscribing organization.
       *
       * Therefore:
       *
       * organizationId = null
       * scope = PLATFORM
       */

      if (
        user.organizationId !==
        null
      ) {
        throw new Error(
          "Super Admin accounts must not belong to an organization."
        );
      }

      scope = "PLATFORM";
    }

    // -----------------------------------------------------
    // ORGANIZATION-LEVEL USER
    // -----------------------------------------------------

    else {
      /*
       * Every organization user must belong
       * to exactly one organization.
       */

      if (
        user.organizationId ===
        null
      ) {
        throw new Error(
          "This account is not assigned to an organization."
        );
      }

      scope = "ORGANIZATION";
    }

    // =====================================================
    // UPDATE LAST LOGIN
    // =====================================================

    await authRepository.updateLastLogin(
      user.id
    );

    // =====================================================
    // CREATE JWT
    // =====================================================

    const token =
      await generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId:
          user.organizationId,
        scope,
      });

    // =====================================================
    // REMOVE PASSWORD HASH
    // =====================================================

    const {
      passwordHash,
      ...safeUser
    } = user;

    // =====================================================
    // RETURN AUTHENTICATED USER
    // =====================================================

    return {
      token,

      user: {
        ...safeUser,
        scope,
      },
    };
  }

  // =======================================================
  // SET PASSWORD
  // =======================================================

  async setPassword(
    email: string,
    password: string
  ) {
    const user =
      await authRepository.findUserByEmail(
        email
      );

    if (!user) {
      throw new Error(
        "User not found."
      );
    }

    // -----------------------------------------------------
    // HASH PASSWORD
    // -----------------------------------------------------

    const passwordHash =
      await hashPassword(
        password
      );

    // -----------------------------------------------------
    // SAVE PASSWORD
    // -----------------------------------------------------

    await authRepository.updatePassword(
      email,
      passwordHash
    );

    return {
      success: true,
    };
  }
}

// =======================================================
// SINGLE AUTH SERVICE INSTANCE
// =======================================================

export const authService =
  new AuthService();