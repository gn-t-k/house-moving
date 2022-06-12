import type { NextApiHandler } from "next";
import { getUsers } from "@/libs/prisma/query/get-users";
import { Result } from "@/util/result";

const getHandler: NextApiHandler<Result<unknown>> = async (_req, res) => {
  const result = await getUsers();

  if (result.isSuccess) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
};

const handler: NextApiHandler<Result<unknown>> = async (req, res) => {
  if (req.method === "GET") {
    getHandler(req, res);
  } else {
    res.status(405).json({
      isSuccess: false,
      failure: {
        message: "method not allowed",
      },
    });
  }
};
export default handler;
