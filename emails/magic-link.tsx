import {Body, Container, Head, Heading, Hr, Html, Preview, Button, Text} from "@react-email/components";
import TailwindWrapper from "./_tailwind";

interface MagicLinkEmailProps {
    link: string;
    site_name: string;
    site_logo: string;
}

const MagicLinkEmail = (props: MagicLinkEmailProps) => {

    const fields = {
        site_name: props.site_name || 'Your Site',
        site_logo: props.site_logo || 'https://via.placeholder.com/150',
        link: props.link || 'https://example.com'
    }

    return (
        <TailwindWrapper>
            <Html>
                <Head>

                </Head>
                <Preview>Login with this magic link</Preview>

                <Body className={'font-sans'}>
                    <Container>
                        <Heading as="h2">🪄 Sign in to {fields.site_name}</Heading>
                        <Button className={'py-2 px-4 rounded-lg bg-neutral-100 text-neutral-900'}
                                href={fields.link}>
                            👉 Click here to sign in 👈
                        </Button>
                        <Text>If you didn&apos;t request this, please ignore this email.</Text>
                        <Hr/>
                    </Container>
                </Body>
            </Html>
        </TailwindWrapper>
    )

}

export default MagicLinkEmail;