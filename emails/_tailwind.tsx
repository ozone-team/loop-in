import {Tailwind} from "@react-email/components";

const TailwindWrapper = ({ children }: any) => {

    return (
        <Tailwind
            config={{

            }}
        >
            { children }
        </Tailwind>
    )

}

export default TailwindWrapper;