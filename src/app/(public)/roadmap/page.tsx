import Image from "next/image";
import {prisma} from "@/lib/prisma";
import StatusColumn from "@/components/boards/statusColumn";
import {GetRoadmap} from "@/app/(public)/roadmap/actions";
import RoadmapPageClient from "@/app/(public)/roadmap/page.client";
import { GetConfig } from "@/lib/config";

export async function generateMetadata(){
    const {site_name} = await GetConfig('site_name');
    return {
        title: `Roadmap | ${site_name}`
    }
}

const Home = async () => {

    const statuses = await GetRoadmap()

    return (
        <RoadmapPageClient statuses={statuses}/>
    );
}

export const revalidate = 0;

export default Home;
