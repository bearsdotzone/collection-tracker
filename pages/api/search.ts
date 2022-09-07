import { createClient, SchemaFieldTypes, SearchOptions } from 'redis';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const client = createClient({});
    client.connect();
    // client.on('connect', () => console.log('connected to redis successfully!'));
    // client.on('error', (err) => console.log('Redis Client Error', err));

    if (!('q' in req.query) || !req.query['q']) {
        return res.status(204).end()
    }

    var query_results = await client.ft.search('idx:cards', req.query['q'].toString())
    await client.quit()
    if (query_results.total == 0) {
        return res.status(204).end()
    }

    var query_values = []
    query_results['documents'].forEach(element => {
        query_values.push(element['value'])
    });

    return res.status(200).json(query_values)
}