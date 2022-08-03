import type { ApiHandler } from "@/api-routes-types";
import { Muscle } from "@/features/muscle/muscle";

export type GetHandler = ApiHandler<{}, {}, { muscles: Muscle[] }>;
const getHandler: GetHandler = async (_req, res) => {};

export type PostHandler = ApiHandler<{}, { muscle: Muscle }, { id: string }>;
