import {prisma} from "@/lib/prisma";

export async function GetConfig(...fields: string[]) {

    // get the values of the fields from the database Config key-value pair table

    let obj: Record<string, any> = {};

    let records = await prisma.config.findMany(fields.length ? {
        where: {
            key: {
                in: fields
            }
        }
    } : undefined);

    records.forEach((record) => {
        obj[record.key] = record.value;
    });

    return obj;

}

export async function UpdateConfig(data: Record<string, string>) {

    const updatePromises = Object.keys(data).map(key => {
        return prisma.config.upsert({
            where: { key },
            update: { value: data[key] },
            create: { key, value: data[key] },
        });
    });

    await Promise.all(updatePromises);
}