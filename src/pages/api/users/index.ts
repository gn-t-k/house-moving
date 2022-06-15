import type { ApiHandler } from "@/api-routes-types";
import { createUserID, User, UserID } from "@/features/user/user";
import { createUser } from "@/libs/prisma/command/create-user";
import { getUsers } from "@/libs/prisma/query/get-users";

export type GetHandler = ApiHandler<{}, {}, User[]>;
const getHandler: GetHandler = async (_req, res) => {
  const result = await getUsers();

  if (result.isSuccess) {
    res.status(200).json(result);
  } else {
    res.status(500).json({
      ...result,
      error: {
        ...result.error,
        httpStatus: 500,
      },
    });
  }
};

export type PostHandler = ApiHandler<{}, User, UserID>;
const postHandler: PostHandler = async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      isSuccess: false,
      error: {
        httpStatus: 400,
        message: "invalid request",
      },
    });
  } else {
    const result = await createUser(req.body);

    if (result.isSuccess) {
      res.status(200).json(result);
    } else {
      res.status(500).json({
        ...result,
        error: {
          ...result.error,
          httpStatus: 500,
        },
      });
    }
  }
};

const handler: ApiHandler = async (req, res) => {
  if (req.method === "GET") {
    getHandler(req, res);
  } else if (req.method === "POST") {
    postHandler(req, res);
  } else {
    res.status(405).json({
      isSuccess: false,
      error: {
        httpStatus: 405,
        message: "method not allowed",
      },
    });
  }
};
export default handler;
