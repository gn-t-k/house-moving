import type { ApiHandler } from "@/api-routes-types";
import { Muscle } from "@/features/muscle/muscle";
import { Trainee } from "@/features/trainee/trainee";
import { insertMuscle } from "@/libs/prisma/command/insert-muscle";
import { getMuscleByName } from "@/libs/prisma/query/get-muscle-by-name";

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

export type GetHandler = ApiHandler<{ name?: string }, {}, Muscle | null>;
const getHandler: GetHandler = async (req, res) => {
  if (req.query.name !== undefined) {
    const getMuscleByNameResult = await getMuscleByName(req.query.name);

    if (getMuscleByNameResult.isSuccess) {
      res.status(200).json({
        isSuccess: true,
        data: getMuscleByNameResult.data,
      });
    } else {
      res.status(500).json({
        ...getMuscleByNameResult,
        error: {
          ...getMuscleByNameResult.error,
          httpStatus: 500,
        },
      });
    }
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

export type PostHandler = ApiHandler<
  {},
  { trainee: Trainee; muscle: Muscle },
  {}
>;
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
    const { trainee, muscle } = req.body;

    const result = await insertMuscle(trainee, muscle);

    if (result.isSuccess) {
      res.status(200);
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
