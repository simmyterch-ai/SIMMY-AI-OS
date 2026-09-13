import Button from "./Button";

type PageHeaderProps = {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

export default function PageHeader({
  title,
  description,
  buttonText,
  onButtonClick,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-slate-500">
          {description}
        </p>
      </div>

      {buttonText && (
        <Button
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      )}

    </div>
  );
}