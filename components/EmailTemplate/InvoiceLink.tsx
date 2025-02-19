import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  import * as React from 'react';
  
  export interface InvoiceLinkProps {
    invoiceLink?: string;
    preview: string;
    title: string;
    username?: string;
  }
  
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
//     ? `https://${process.env.VERCEL_URL}`
//     : '';
  
export const InvoiceLink = ({
    invoiceLink,
    preview = "Payment Invoice for The Second Installment Mande on 23rd March",
    title = "Payment Invoice for The Second Installment Mande on 23rd March",
    username
  }: InvoiceLinkProps) => (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>{preview}</Preview>
        <Container style={container}>
          
          <Heading style={heading}>🪄 {title}</Heading>
          <Section style={body}>
            <Text style={paragraph}>
              <Link style={link} href={invoiceLink}>
                👉 Click here to sign in 👈
              </Link>
            </Text>
            <Text style={paragraph}>
              Hoping your doing fine, here is  your Payment Invoice, Click the Link below to download the Invoice or View the Invoice Details
            </Text>
          </Section>
          <Text style={paragraph}>
            Best Regards, {username}
          </Text>
          <Hr style={hr} />
          
          
        </Container>
      </Body>
    </Html>
  );
  

  export default InvoiceLink;
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: '0 auto',
    padding: '20px 25px 48px',
    backgroundImage: 'url("/static/raycast-bg.png")',
    backgroundPosition: 'bottom',
    backgroundRepeat: 'no-repeat, no-repeat',
  };
  
  const heading = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginTop: '48px',
  };
  
  const body = {
    margin: '24px 0',
  };
  
  const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
  };
  
  const link = {
    color: '#FF6363',
  };
  
  const hr = {
    borderColor: '#dddddd',
    marginTop: '48px',
  };
  
  const footer = {
    color: '#8898aa',
    fontSize: '12px',
    marginLeft: '4px',
  };
  