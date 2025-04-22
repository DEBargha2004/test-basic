import { useForm } from "react-hook-form";

export type TFormDefaultParams<T extends Record<string, any>> = {
  form: ReturnType<typeof useForm<T>>;
  onSubmit: (data: T) => void;
};

export type TFormChildrenDefaultParams<T extends Record<string, any>> = {
  form: ReturnType<typeof useForm<T>>;
};
