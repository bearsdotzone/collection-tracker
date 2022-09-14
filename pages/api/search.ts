import { createClient, SchemaFieldTypes, SearchOptions } from 'redis';
import { NextApiRequest, NextApiResponse } from 'next';
import SearchQuery, { SearchParserResult } from 'search-query-parser'
import { unstable_getServerSession } from "next-auth/next"
import { options } from "./auth/[...nextauth]";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const session = await unstable_getServerSession(req, res, options)

    if (!session) {
        return res.status(401).end()
    }

    const client = createClient({});
    client.connect();
    // client.on('connect', () => console.log('connected to redis successfully!'));
    // client.on('error', (err) => console.log('Redis Client Error', err));

    if (!('q' in req.query) || !req.query['q']) {
        return res.status(204).end()
    }

    // parse query

    const SearchOptions = { keywords: ['name', 'lang', 'type', 'set', 'order', 'include'], tokenize: true, offsets: false }

    const parsed = SearchQuery.parse(req.query['q'].toString(), SearchOptions)

    if (typeof (parsed) == 'string') {
        console.log("something horrible has happened");
        return;
    }

    // construct redis query
    var rQuery = "";
    if (parsed.name) {
        rQuery += "@name:" + parsed.name + " "
    }

    if (parsed.text) {
        rQuery += "@name: " + parsed.text + " "
    }

    if (parsed.type) {
        rQuery += "@type_line:" + (parsed.type) + " "
    }

    if (parsed.set) {
        rQuery += "@set:" + (parsed.set) + " "
    }

    if (parsed.lang) {
        rQuery += "@lang:" + parsed.lang + " "
    } else {
        rQuery += "@lang:en "
    }

    // Nots have to go at end?

    if (parsed.include) {
        rQuery += "@set_type:memorabilia "
    } else {
        rQuery += "-@set_type:memorabilia "
    }


    var rOptions = {}

    if (parsed.order) {
        rOptions['SORTBY'] = parsed.order
    } else {
        rOptions['SORTBY'] = "name"
    }

    rOptions['LIMIT'] = { 'from': 0, 'size': 25 }


    // console.log(rQuery)

    const query_results = await client.ft.search('idx:cards', rQuery, rOptions)

    await client.quit()
    if (query_results.total == 0) {
        return res.status(204).end()
    }

    //error - [ErrorReply: LOADING Redis is loading the dataset in memory] { page: '/api/search'}

    var query_values = []
    query_results['documents'].forEach(element => {
        query_values.push(element['value'])
    });

    return res.status(200).json(query_values)
}