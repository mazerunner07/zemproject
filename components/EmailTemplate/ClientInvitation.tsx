import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

export interface InvitationProps {
  clientName: string;
  projectName: string;
  loginEmail: string;
  loginPassword: string;
  loginUrl: string;
}

export const ClientInvitation = ({
  clientName,
  projectName,
  loginEmail,
  loginPassword,
  loginUrl,
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
      <Preview>You're invited to collaborate on {projectName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Project Collaboration Invitation</Heading>
          <Section>
            <Text style={paragraph}>Hello {clientName},</Text>
            <Text style={paragraph}>
              We're excited to invite you to collaborate on our project: <strong>{projectName}</strong>. Your insights
              and expertise will be invaluable to our team.
            </Text>
            <Text style={paragraph}>To get started, please use the following login details:</Text>
            <Text style={paragraph}>
              <strong>Email:</strong> {loginEmail}
              <br />
              <strong>Password:</strong> {loginPassword}
            </Text>
            <Text style={paragraph}>
              For security reasons, we recommend changing your password after your first login.
            </Text>
          </Section>
          <Section style={{ textAlign: "center", marginTop: "26px", marginBottom: "26px" }}>
            <a href={loginUrl} style={button}>Log In to Project</a> {/* ✅ Replaced Link & Button */}
          </Section>
          <Hr style={{ borderColor: "#cccccc", margin: "20px 0" }} />
          <Text style={{ ...paragraph, fontSize: "14px", color: "#888888" }}>
            If you have any questions or need assistance, please don't hesitate to reach out to our team. We're looking
            forward to working with you!
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ClientInvitation;
