import TailwindWrapper from "./_tailwind";
import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Row,
    Text
} from "@react-email/components";

interface PostCommentEmailProps {
    site_name: string;
    site_logo: string;
    commenter_name: string;
    commenter_image: string;
    title: string;
    body: string;
    link: string;
    intended_for: string;
    preview: string;
}

const PostCommentEmail = (props: PostCommentEmailProps) => {

    const fields = {
        site_name: props.site_name || 'Your Site',
        title: props.title || 'Title of the change here',
        body: props.body || 'Description of the change here',
        link: props.link || 'https://example.com',
        intended_for: props.intended_for || 'Joe Blogs',
        preview: props.preview || 'Post update',
        commenter_name: props.commenter_name || 'Joe Blogs',
        commenter_image: props.commenter_image || 'https://placehold.co/128'
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
                        <Heading as="h3">💬 New Comment</Heading>
                        <Hr/>
                        <Heading as="h2">{fields.title}</Heading>
                        <Row width={'100%'}>
                            <Column className={'w-8'}>
                                <Img src={fields.commenter_image} alt={fields.commenter_name} className={'rounded-full'} width={32} height={32}/>
                            </Column>
                            <Column className={'pl-2'}>
                                <Text>{fields.commenter_name}</Text>
                            </Column>
                        </Row>
                        <div dangerouslySetInnerHTML={{__html: fields.body}}/>
                        <Button
                            href={fields.link}
                            className={'bg-black text-white px-4 py-3 mb-12 mt-4'}
                        >
                            View Comment
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

export default PostCommentEmail;