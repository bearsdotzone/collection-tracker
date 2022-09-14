import { createClient, SchemaFieldTypes, SearchOptions } from "redis";
import { NextApiRequest, NextApiResponse } from "next";
import SearchQuery, { SearchParserResult } from "search-query-parser";
import { unstable_getServerSession } from "next-auth/next";
import { options } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { useSession, signIn, signOut } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, options);
  // const session = useSession();

  if (!session || !session.user.email) {
    return res.status(401).end();
  }

  const returnedCollectionObjects = await prisma.collection.findMany({
    where: { user: { email: session.user.email } },
  });

  // console.log(returnedCollectionObjects);

  return res.status(200).send(returnedCollectionObjects);
  // return res.status(200).send(returnedCollectionObjects);
}
