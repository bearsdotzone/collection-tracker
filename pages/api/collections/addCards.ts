import { createClient, SchemaFieldTypes, SearchOptions } from 'redis';
import { NextApiRequest, NextApiResponse } from 'next';
import SearchQuery, { SearchParserResult } from 'search-query-parser'
import { unstable_getServerSession } from "next-auth/next"
import { options } from "../auth/[...nextauth]";
import prisma from '../../../lib/prisma';
import { useSession, signIn, signOut } from "next-auth/react";

export default async function handler(req: NextApiRequest,
    res: NextApiResponse) {

    const session = await unstable_getServerSession(req, res, options);

    if (!session || !session.user.email) {
        return res.status(401).end();
    }

    const cId = String(req.query['cId'])
    const toAdd = req.query['toAdd']

    const currentCards = (
        await prisma.collection.findUnique({ where: { id: cId } })
    )["cards"];

    const newCards = currentCards.concat(toAdd)

    const updateCards = await prisma.collection.update({ where: { id: cId }, data: { cards: newCards } })

    return res.status(200).json(updateCards);
}