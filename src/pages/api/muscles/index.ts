import { NextApiHandler } from "next";
import { Muscle } from "@/features/muscle/muscle";
import { Trainee } from "@/features/trainee/trainee";
import { insertMuscle } from "@/libs/prisma/command/insert-muscle";
import { getMuscleByName } from "@/libs/prisma/query/get-muscle-by-name";

const muscleHandler: NextApiHandler = async (req, res) => {
  const handler: NextApiHandler =
    req.method === "GET"
      ? getHandler
      : req.method === "POST"
      ? postHandler
      : (req, res) => {
          res.status(405).json({
            isSuccess: false,
            error: {
              httpStatus: 405,
              message: "method not allowed",
            },
          });
          console.error({ req, res });
        };

  handler(req, res);
};
export default muscleHandler;

const getHandler: NextApiHandler = async (req, res) => {
  const name = req.query.name;
  const isValidRequest = typeof name === "string";

  if (!isValidRequest) {
    res.status(400).json({
      isSuccess: false,
      error: {
        httpStatus: 400,
        message: "invalid request",
      },
    });
    console.error({ req, res });

    return;
  }

  const result = await getMuscleByName(name);

  if (!result.isSuccess) {
    res.status(500).json({
      ...result,
      error: {
        ...result.error,
        httpStatus: 500,
      },
    });
    console.error({ req, res });

    return;
  }

  res.status(200).json({
    isSuccess: true,
    data: result.data,
  });
};

const postHandler: NextApiHandler = async (req, res) => {
  const trainee = req.body?.trainee;
  const muscle = req.body?.muscle;
  const isValidRequest =
    Trainee.build(trainee).isSuccess && Muscle.reconstruct(muscle).isSuccess;

  if (!isValidRequest) {
    res.status(400).json({
      isSuccess: false,
      error: {
        httpStatus: 400,
        message: "invalid request",
      },
    });
    console.error({ req, res });

    return;
  }

  const result = await insertMuscle(trainee, muscle);

  if (!result.isSuccess) {
    res.status(500).json({
      ...result,
      error: {
        ...result.error,
        httpStatus: 500,
      },
    });
    console.error({ req, res });

    return;
  }

  res.status(200).json({
    isSuccess: true,
    data: {},
  });
};
