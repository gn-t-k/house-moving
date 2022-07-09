export type Session = {
  id: string;
  user: {
    name: string;
    email: string;
    image: string;
  };
};

export const isValidSession = (data: unknown): data is Session => {
  const session = data as Session;

  return (
    typeof session?.id === "string" &&
    typeof session?.user.name === "string" &&
    typeof session?.user.email === "string" &&
    typeof session?.user.image === "string"
  );
};
