import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

export interface InvitationProps {
  memberName: string;
  projectName: string;
  loginUrl: string;
  projectOwner : string
}

export const MemberInvitation = ({
  memberName,
  projectName,
  loginUrl,
  projectOwner
}: InvitationProps) => {
  const main = {
    backgroundColor: "#ffffff",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  };

  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    width: "580px",
  };

  const heading = {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    color: "#484848",
  };

  const paragraph = {
    fontSize: "18px",
    lineHeight: "1.4",
    color: "#484848",
  };

  const button = {
    backgroundColor: "#5F51E8",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "18px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
  };

  return (
    <Html>
      <Head />
      <Preview>You're invited to join {projectName} on ZEM Project</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>You're Invited to Join a Project</Heading>
          <Section>
            <Text style={paragraph}>Hello {memberName},</Text>
            <Text style={paragraph}>
              You have been invited to collaborate on the project <strong>{projectName}</strong> in the ZEM Project
              platform from {projectOwner}. Your contribution will be valuable to the success of this project.
            </Text>
            <Text style={paragraph}>
              Click the button below to accept the invitation and access the project dashboard.
            </Text>
          </Section>
          <Section style={{ textAlign: "center", marginTop: "26px", marginBottom: "26px" }}>
            <a href={loginUrl} style={button}>Join Project</a>
          </Section>
          <Hr style={{ borderColor: "#cccccc", margin: "20px 0" }} />
          <Text style={{ ...paragraph, fontSize: "14px", color: "#888888" }}>
            If you have any questions or need assistance, please contact our support team. We look forward to working
            with you!
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default MemberInvitation;
