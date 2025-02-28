/**
 * Generates an official company email template with branding
 * @param subject - Email subject
 * @param body - Rich text email body content (HTML)
 * @param recipientName - Name of the email recipient
 * @param options - Additional options like company name, logo URL, etc.
 * @returns HTML email template as a string
 */
export function sendGeneralEmail({
    subject,
    body,
    recipientName,
    options = {},
  }: {
    subject: string
    body: string
    recipientName: string
    options?: {
      companyName?: string
      logoUrl?: string
      primaryColor?: string
      secondaryColor?: string
      footerText?: string
      senderName?: string
      senderTitle?: string
    }
  }) {
    const {
      companyName = "Zem Project",
      logoUrl = "data:image/jpeg;base64,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",
      primaryColor = "#2563eb",
      secondaryColor = "#f8fafc",
      footerText = "© 2025 Zem Project. All rights reserved.",
      senderName = "Vaibhav Sarvaiya",
      senderTitle = "CEO",
    } = options
  
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f9fafb; color: #1f2937;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <!-- Header with logo -->
              <tr>
                <td style="padding: 24px 40px; background-color: ${primaryColor};">
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td>
                        <img src="${logoUrl}" alt="${companyName}" style="height: 40px; width: auto;">
                      </td>
                      <td align="right" style="color: #ffffff; font-weight: 600; font-size: 14px;">
                        OFFICIAL COMMUNICATION
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Personalized greeting -->
              <tr>
                <td style="padding: 32px 40px 0; text-align: left;">
                  <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Dear ${recipientName},</h2>
                </td>
              </tr>
              
              <!-- Subject line -->
              <tr>
                <td style="padding: 16px 40px 0; text-align: left;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827;">${subject}</h1>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td style="padding: 24px 40px; text-align: left; line-height: 1.6;">
                  ${body}
                </td>
              </tr>
              
              <!-- Signature -->
              <tr>
                <td style="padding: 0 40px 24px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding-top: 24px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; font-weight: 600; color: #111827;">${senderName}</p>
                        <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">${senderTitle}</p>
                        <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">${companyName}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 16px 40px; background-color: ${secondaryColor}; text-align: center; font-size: 12px; color: #6b7280;">
                  <p style="margin: 0;">${footerText}</p>
                  <p style="margin: 8px 0 0;">
                    <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                    <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                    <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px;">Unsubscribe</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }
  
  
  /**
   * Generates a newsletter email template for subscribers
   * @param subject - Email subject
   * @param body - Rich text email body content (HTML)
   * @param recipientName - Name of the email recipient
   * @param options - Additional options like company name, logo URL, etc.
   * @returns HTML email template as a string
   */
  export function sendEmailList({
    subject,
    body,
    recipientName,
    options = {},
  }: {
    subject: string
    body: string
    recipientName: string
    options?: {
      companyName?: string
      logoUrl?: string
      primaryColor?: string
      accentColor?: string
      headerImageUrl?: string
      footerText?: string
      socialLinks?: {
        twitter?: string
        facebook?: string
        instagram?: string
        linkedin?: string
      }
    }
  }) {
    const {
      companyName = "Acme Corporation",
      logoUrl = "https://your-company-logo-url.com/logo.png",
      primaryColor = "#2563eb",
      accentColor = "#f97316",
      headerImageUrl = "https://your-header-image-url.com/header.jpg",
      footerText = "© 2025 Acme Corporation. All rights reserved.",
      socialLinks = {
        twitter: "https://twitter.com/acme",
        facebook: "https://facebook.com/acme",
        instagram: "https://instagram.com/acme",
        linkedin: "https://linkedin.com/company/acme",
      },
    } = options
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f9fafb; color: #1f2937;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                <!-- Logo header -->
                <tr>
                  <td style="padding: 24px 40px; text-align: center;">
                    <img src="${logoUrl}" alt="${companyName}" style="height: 40px; width: auto;">
                  </td>
                </tr>
                
                <!-- Header image -->
                <tr>
                  <td>
                    <img src="${headerImageUrl}" alt="Newsletter Header" style="width: 100%; height: auto; display: block;">
                  </td>
                </tr>
                
                <!-- Personalized greeting and newsletter title -->
                <tr>
                  <td style="padding: 32px 40px 0; text-align: center;">
                    <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hello ${recipientName},</h2>
                    <h1 style="margin: 16px 0 0; font-size: 28px; font-weight: 700; color: #111827;">${subject}</h1>
                    <p style="margin: 16px 0 0; color: #6b7280; font-size: 16px;">The latest updates and news from ${companyName}</p>
                  </td>
                </tr>
                
                <!-- Main content -->
                <tr>
                  <td style="padding: 32px 40px; text-align: left; line-height: 1.6;">
                    ${body}
                  </td>
                </tr>
                
                <!-- CTA Button -->
                <tr>
                  <td style="padding: 0 40px 32px; text-align: center;">
                    <a href="#" style="display: inline-block; padding: 12px 24px; background-color: ${accentColor}; color: white; text-decoration: none; font-weight: 600; border-radius: 6px;">Read More Articles</a>
                  </td>
                </tr>
                
                <!-- Social links -->
                <tr>
                  <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 16px; font-weight: 600; color: #111827;">Follow us on social media</p>
                    <table role="presentation" style="width: auto; margin: 0 auto; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="${socialLinks.twitter}" style="display: inline-block; width: 32px; height: 32px; background-color: ${primaryColor}; border-radius: 50%; text-align: center; line-height: 32px; color: white; text-decoration: none;">T</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="${socialLinks.facebook}" style="display: inline-block; width: 32px; height: 32px; background-color: ${primaryColor}; border-radius: 50%; text-align: center; line-height: 32px; color: white; text-decoration: none;">F</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="${socialLinks.instagram}" style="display: inline-block; width: 32px; height: 32px; background-color: ${primaryColor}; border-radius: 50%; text-align: center; line-height: 32px; color: white; text-decoration: none;">I</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="${socialLinks.linkedin}" style="display: inline-block; width: 32px; height: 32px; background-color: ${primaryColor}; border-radius: 50%; text-align: center; line-height: 32px; color: white; text-decoration: none;">L</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; background-color: #f8fafc; text-align: center; font-size: 12px; color: #6b7280;">
                    <p style="margin: 0;">${footerText}</p>
                    <p style="margin: 8px 0 0;">
                      <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                      <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                      <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px;">Unsubscribe</a>
                    </p>
                    <p style="margin: 16px 0 0; font-size: 11px;">
                      If you no longer wish to receive these emails, you can <a href="#" style="color: #6b7280;">unsubscribe</a> at any time.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }
  
  /**
   * Generates a client communication email template
   * @param subject - Email subject
   * @param body - Rich text email body content (HTML)
   * @param recipientName - Name of the email recipient
   * @param options - Additional options like company name, logo URL, etc.
   * @returns HTML email template as a string
   */
  export function sendToClientList({
    subject,
    body,
    recipientName,
    options = {},
  }: {
    subject: string
    body: string
    recipientName: string
    options?: {
      companyName?: string
      logoUrl?: string
      primaryColor?: string
      accentColor?: string
      footerText?: string
      contactInfo?: {
        email?: string
        phone?: string
        website?: string
      }
      senderName?: string
      senderTitle?: string
      senderImageUrl?: string
    }
  }) {
    const {
      companyName = "Acme Corporation",
      logoUrl = "https://your-company-logo-url.com/logo.png",
      primaryColor = "#2563eb",
      accentColor = "#10b981",
      footerText = "© 2025 Acme Corporation. All rights reserved.",
      contactInfo = {
        email: "support@acme.com",
        phone: "+1 (555) 123-4567",
        website: "https://www.acme.com",
      },
      senderName = "John Smith",
      senderTitle = "Account Manager",
      senderImageUrl = "https://your-sender-image-url.com/profile.jpg",
    } = options
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f9fafb; color: #1f2937;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                <!-- Header with logo -->
                <tr>
                  <td style="padding: 24px 40px; border-bottom: 1px solid #e5e7eb;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td>
                          <img src="${logoUrl}" alt="${companyName}" style="height: 40px; width: auto;">
                        </td>
                        <td align="right" style="color: ${primaryColor}; font-weight: 600; font-size: 14px;">
                          CLIENT COMMUNICATION
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Personalized greeting -->
                <tr>
                  <td style="padding: 32px 40px 0; text-align: left;">
                    <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Dear ${recipientName},</h2>
                    <h1 style="margin: 16px 0 0; font-size: 24px; font-weight: 700; color: #111827;">${subject}</h1>
                    <p style="margin: 16px 0 0; color: #4b5563; font-size: 16px;">We value your partnership with us.</p>
                  </td>
                </tr>
                
                <!-- Main content -->
                <tr>
                  <td style="padding: 24px 40px; text-align: left; line-height: 1.6;">
                    ${body}
                  </td>
                </tr>
                
                <!-- CTA Button -->
                <tr>
                  <td style="padding: 0 40px 32px; text-align: left;">
                    <a href="#" style="display: inline-block; padding: 12px 24px; background-color: ${accentColor}; color: white; text-decoration: none; font-weight: 600; border-radius: 6px;">Schedule a Meeting</a>
                  </td>
                </tr>
                
                <!-- Sender info with image -->
                <tr>
                  <td style="padding: 0 40px 32px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; padding: 16px;">
                      <tr>
                        <td style="width: 60px; vertical-align: top;">
                          <img src="${senderImageUrl}" alt="${senderName}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
                        </td>
                        <td style="padding-left: 16px; vertical-align: top;">
                          <p style="margin: 0; font-weight: 600; color: #111827;">${senderName}</p>
                          <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">${senderTitle}</p>
                          <p style="margin: 8px 0 0; font-size: 14px;">
                            <a href="mailto:${contactInfo.email}" style="color: ${primaryColor}; text-decoration: none;">${contactInfo.email}</a>
                          </p>
                          <p style="margin: 4px 0 0; font-size: 14px;">
                            <a href="tel:${contactInfo.phone}" style="color: ${primaryColor}; text-decoration: none;">${contactInfo.phone}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Contact info -->
                <tr>
                  <td style="padding: 32px 40px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-weight: 600; color: #111827;">Need assistance?</p>
                    <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;">
                      Our support team is here to help you with any questions.
                    </p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                      <tr>
                        <td style="text-align: center; padding: 0 8px;">
                          <p style="margin: 0; font-weight: 500; color: #111827;">Email</p>
                          <p style="margin: 4px 0 0; font-size: 14px;">
                            <a href="mailto:${contactInfo.email}" style="color: ${primaryColor}; text-decoration: none;">${contactInfo.email}</a>
                          </p>
                        </td>
                        <td style="text-align: center; padding: 0 8px;">
                          <p style="margin: 0; font-weight: 500; color: #111827;">Phone</p>
                          <p style="margin: 4px 0 0; font-size: 14px;">
                            <a href="tel:${contactInfo.phone}" style="color: ${primaryColor}; text-decoration: none;">${contactInfo.phone}</a>
                          </p>
                        </td>
                        <td style="text-align: center; padding: 0 8px;">
                          <p style="margin: 0; font-weight: 500; color: #111827;">Website</p>
                          <p style="margin: 4px 0 0; font-size: 14px;">
                            <a href="${contactInfo.website}" style="color: ${primaryColor}; text-decoration: none;">${contactInfo.website}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 16px 40px; background-color: #f1f5f9; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0;">${footerText}</p>
                    <p style="margin: 8px 0 0;">
                      <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                      <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }
  
  