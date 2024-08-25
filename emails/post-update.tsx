import TailwindWrapper from "./_tailwind";
import {Body, Button, Container, Head, Heading, Hr, Html, Preview, Text} from "@react-email/components";

interface PostUpdateProps {
    site_name: string;
    site_logo: string;
    title: string;
    body: string;
    link: string;
    intended_for: string;
    preview: string;
}

const PostUpdate = (props: PostUpdateProps) => {

    const fields = {
        site_name: props.site_name || 'Your Site',
        title: props.title || 'Title of the change here',
        body: props.body || 'Description of the change here',
        link: props.link || 'https://example.com',
        intended_for: props.intended_for || 'Joe Blogs',
        preview: props.preview || 'Post update'
    }

    return (
        <TailwindWrapper>
            <Html>
                <Head />
                <Preview>
                    {fields.preview}
                </Preview>
                <Body className={'font-sans'}>
                    <Container className={'border p-4'}>
                        <Heading as="h3">📢 {fields.site_name} Update</Heading>
                        <Hr/>
                        <Heading as="h2">{fields.title}</Heading>
                        <div dangerouslySetInnerHTML={{__html: fields.body}}/>
                        <Button
                            href={fields.link}
                            className={'bg-black text-white px-4 py-3 mb-12 mt-4'}
                        >
                            View Post
                        </Button>
                        <Hr/>
                        <Text>
                            This email was intended for {fields.intended_for}. If you didn&apos;t request this, please
                            ignore this email.
                        </Text>
                    </Container>
                </Body>
            </Html>
        </TailwindWrapper>
    )

}

export default PostUpdate;