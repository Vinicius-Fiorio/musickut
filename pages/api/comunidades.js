import { SiteClient  } from 'datocms-client';

export default async function Requests(request,response){

    if(request.method === "POST"){
        const TOKEN = 'e013c8efc43cb56161a7c0efb212cb';

        const client = new SiteClient(TOKEN);

        const create = await client.items.create({
            itemType: "972644",
            ...request.body
        })
        
        response.json({
            created: create
        })
    }
    
}