export type Session = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export const isValidSession = (data: unknown): data is Session => {
  const session = data as Session;

  return (
    typeof session?.id === "string" &&
    typeof session?.name === "string" &&
    typeof session?.email === "string" &&
    typeof session?.image === "string"
  );
};
