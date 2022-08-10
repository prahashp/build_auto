/**
 * @name api_core_modules_email
 * @description Email Module
 */

// Modules
const aws = require(".././aws"),
  // configuration
  config = require("../../../.././config");

module.exports.sendEmailOTP = (data) => {
  const subject = "Tango Eye - OTP Verification";
  const template = `<!doctype html>
  <html lang="en">
     <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Signup Verification</title>
        <style type="text/css">
           a { text-decoration: none; outline: none; }
           @media (max-width: 649px) {
           .o_col-full { max-width: 100% !important; }
           .o_col-half { max-width: 50% !important; }
           .o_hide-lg { display: inline-block !important; font-size: inherit !important; max-height: none !important; line-height: inherit !important; overflow: visible !important; width: auto !important; visibility: visible !important; }
           .o_hide-xs, .o_hide-xs.o_col_i { display: none !important; font-size: 0 !important; max-height: 0 !important; width: 0 !important; line-height: 0 !important; overflow: hidden !important; visibility: hidden !important; height: 0 !important; }
           .o_xs-center { text-align: center !important; }
           .o_xs-left { text-align: left !important; }
           .o_xs-right { text-align: left !important; }
           table.o_xs-left { margin-left: 0 !important; margin-right: auto !important; float: none !important; }
           table.o_xs-right { margin-left: auto !important; margin-right: 0 !important; float: none !important; }
           table.o_xs-center { margin-left: auto !important; margin-right: auto !important; float: none !important; }
           h1.o_heading { font-size: 32px !important; line-height: 41px !important; }
           h2.o_heading { font-size: 26px !important; line-height: 37px !important; }
           h3.o_heading { font-size: 20px !important; line-height: 30px !important; }
           .o_xs-py-md { padding-top: 24px !important; padding-bottom: 24px !important; }
           .o_xs-pt-xs { padding-top: 8px !important; }
           .o_xs-pb-xs { padding-bottom: 8px !important; }
           }
           @media screen {
           @font-face {
           font-family: 'Roboto';
           font-style: normal;
           font-weight: 400;
           src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format("woff2");
           unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
           @font-face {
           font-family: 'Roboto';
           font-style: normal;
           font-weight: 400;
           src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format("woff2");
           unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
           @font-face {
           font-family: 'Roboto';
           font-style: normal;
           font-weight: 700;
           src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format("woff2");
           unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
           @font-face {
           font-family: 'Roboto';
           font-style: normal;
           font-weight: 700;
           src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format("woff2");
           unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
           .o_sans, .o_heading { font-family: "Roboto", sans-serif !important; }
           .o_heading, strong, b { font-weight: 700 !important; }
           a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
           }
        </style>
        <!--[if mso]>
        <style>
           table { border-collapse: collapse; }
           .o_col { float: left; }
        </style>
        <xml>
           <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
     </head>
     <body class="o_body o_bg-light" style="width: 100%;margin: 0px;padding: 0px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;background-color: #dbe5ea;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_hide" align="center" style="display: none;font-size: 0;max-height: 0;width: 0;line-height: 0;overflow: hidden;mso-hide: all;visibility: hidden;">Email Summary (Hidden)</td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-top: 32px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_re o_bg-dark o_px o_pb-md o_br-t" align="center" style="font-size: 0;vertical-align: top;background-color: #fff;border-radius: 4px 4px 0px 0px;padding-left: 16px;padding-right: 16px;padding-bottom: 24px;">
                                <div class="o_col o_col-2" style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px;">
                                   <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                                   <div class="o_px-xs o_sans o_text o_left o_xs-center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;text-align: left;padding-left: 8px;padding-right: 8px;">
                                      <p style="margin-top: 0px;margin-bottom: 0px;"><a class="o_text-white" href="https://example.com/" style="text-decoration: none;outline: none;color: #ffffff;"><img src="https://tangoeye.ai/wp-content/uploads/2021/06/tangoeye-logo.png" width="136" height="36" alt="SimpleApp" style="max-width: 136px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a></p>
                                   </div>
                                </div>
                                <div class="o_col o_col-4" style="display: inline-block;vertical-align: top;width: 100%;max-width: 400px;">
                                   <div style="font-size: 22px; line-height: 22px; height: 22px;">&nbsp; </div>
                                   <div class="o_px-xs" style="padding-left: 8px;padding-right: 8px;">
                                   </div>
                                </div>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-primary o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-white" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #126de5;color: #ffffff;padding-left: 24px;padding-right: 24px;padding-top: 64px;padding-bottom: 64px;">
                                <table cellspacing="0" cellpadding="0" border="0" role="presentation">
                                </table>
                                <h2 class="o_heading o_mb-xxs" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 4px;font-size: 30px;line-height: 39px;">Sign Up OTP Verification</h2>
                                <p style="margin-top: 0px;margin-bottom: 0px;">Before you get started with your new account you'll need to confirm that <b>${data.email}</b> is your email address. Please use this below OTP to verify your account.</p>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-white" style="font-size: 48px;line-height: 48px;height: 48px;background-color: #ffffff;">&nbsp; </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-white o_px-md o_py o_sans o_text-xs o_text-light" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;background-color: #ffffff;color: #82899a;padding-left: 24px;padding-right: 24px;padding-top: 16px;padding-bottom: 16px;">
                                <p class="o_mb" style="margin-top: 0px;margin-bottom: 16px;"><strong>Here is Your One Time Verification Code</strong></p>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                   <tbody>
                                      <tr>
                                         <td width="384" class="o_bg-ultra_light o_br o_text-md o_sans o_px-xs o_py-md" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #ebf5fa;border-radius: 4px;padding-left: 8px;padding-right: 8px;padding-top: 24px;padding-bottom: 24px;">
                                            <p class="o_text-dark" style="color: #242b3d;margin-top: 0px;margin-bottom: 0px;"><strong> ${data.otp} </strong></p>
                                         </td>
                                      </tr>
                                   </tbody>
                                </table>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-white" style="font-size: 24px;line-height: 24px;height: 24px;background-color: #ffffff;">&nbsp; </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-white o_px-md o_py" align="left" style="background-color: #ffffff;padding-left: 24px;padding-right: 24px;padding-top: 16px;padding-bottom: 16px;">
                                <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                                   <tbody>
                                      <tr>
                                         <td width="40" class="o_bg-dark o_br-l o_text-md o_text-white o_sans o_py-xs" align="right" style="vertical-align: top;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #242b3d;color: #ffffff;border-radius: 4px 0px 0px 4px;padding-top: 8px;padding-bottom: 8px;">
                                            <img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/warning-24-white.png" width="24" height="24" alt="" style="max-width: 24px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;">
                                         </td>
                                         <td class="o_bg-dark o_br-r o_text-xs o_text-white o_sans o_px o_py-xs" align="left" style="vertical-align: top;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;background-color: #242b3d;color: #ffffff;border-radius: 0px 4px 4px 0px;padding-left: 16px;padding-right: 16px;padding-top: 8px;padding-bottom: 8px;">
                                            <p style="margin-top: 0px;margin-bottom: 0px;"><strong>Information.</strong></p>
                                         </td>
                                      </tr>
                                   </tbody>
                                </table>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-white" style="font-size: 24px;line-height: 24px;height: 24px;background-color: #ffffff;">&nbsp; </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-bottom: 32px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-white o_br-b o_sans" style="font-size: 8px;line-height: 8px;height: 8px;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;background-color: #ffffff;border-radius: 0px 0px 4px 4px;">&nbsp; </td>
                          </tr>
                          <tr>
                             <td class="o_re o_px o_pb-lg" align="center" style="font-size: 0;vertical-align: top;padding-left: 16px;padding-right: 16px; background-color: #ffffff; color:">
                                <div class="o_col o_col-2 o_col-full" style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px; ">
                                   <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                                   <div class="o_px-xs o_sans o_text-xs o_center" style="font-family: Helvetica, Arial, sans-serif;margin-top: -38px;
                                      margin-bottom: 12px;font-size: 14px;line-height: 21px;text-align: center;padding-left: 8px;padding-right: 8px;">
                                      <p style="margin-top: 0px;margin-bottom: 0px;">
                                         <a class="o_text-light" href="https://example.com/" style="text-decoration: none;outline: none;color: #82899a;"><img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/facebook-light.png" width="36" height="36" alt="fb" style="max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a><span> &nbsp;</span>
                                         <a class="o_text-light" href="https://example.com/" style="text-decoration: none;outline: none;color: #82899a;"><img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/twitter-light.png" width="36" height="36" alt="tw" style="max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a><span> &nbsp;</span>
                                         <a class="o_text-light" href="https://example.com/" style="text-decoration: none;outline: none;color: #82899a;"><img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/instagram-light.png" width="36" height="36" alt="ig" style="max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a><span> &nbsp;</span>
                                      </p>
                                   </div>
                                </div>
                             </td>
                          </tr>
                          <tr>
                             <td class="o_px-md o_pb-lg o_sans o_text-xs o_text-light" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;color: #82899a;padding-left: 24px;padding-right: 24px;padding-bottom: 32px; background-color: #ffffff;">
                                <p class="o_mb-xs" style="margin-top: 0px;margin-bottom: 8px;">©2021 TangoEye<br>
                                   Our Headquarters: 603, Anna Salai, <br>
                                   Kannammai Building, First Floor,<br>
                                   Chennai-600 006
                                </p>
                                <p style="margin-top: 0px;margin-bottom: 0px;">
                                   <a class="o_text-xxs  o_underline" href="https://tangoeye.ai/" style="text-decoration: underline;outline: none;font-size: 12px;line-height: 19px;color: #a0a3ab;">https://tangoeye.ai/</a>
                                </p>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                    <div class="o_hide-xs" style="font-size: 64px; line-height: 64px; height: 64px;">&nbsp; </div>
                 </td>
              </tr>
           </tbody>
        </table>
     </body>
  </html>`;

  return aws.sendEmail(data.email, subject, template);
};

module.exports.sendResetPasswordEmail_old = (data) => {
  const subject = "Tango Eye - Reset your password";
  const template = `
        OTP to Reset Password: <strong>${data.otp}</strong>
    `;

  return aws.sendEmail(data.email, subject, template);
};

module.exports.sendActivateAccountEmail = (data) => {
  const subject = "Tango Eye - Activate your Account";
  const template = `
        Click Link: <a href='${
          config.app.url + config.auth.urls.verifyAccount
        }?t=${data.token}'>Activate Account</a>
    `;

  return aws.sendEmail(data.email, subject, template);
};

module.exports.sendUserCreationEmail = (data) => {
  const subject = "Tango Eye - Account created";
  const template = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="x-apple-disable-message-reformatting" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Client Verified</title>
      <style type="text/css">
        a {
          text-decoration: none;
          outline: none;
        }
        @media (max-width: 649px) {
          .o_col-full {
            max-width: 100% !important;
          }
          .o_col-half {
            max-width: 50% !important;
          }
          .o_hide-lg {
            display: inline-block !important;
            font-size: inherit !important;
            max-height: none !important;
            line-height: inherit !important;
            overflow: visible !important;
            width: auto !important;
            visibility: visible !important;
          }
          .o_hide-xs,
          .o_hide-xs.o_col_i {
            display: none !important;
            font-size: 0 !important;
            max-height: 0 !important;
            width: 0 !important;
            line-height: 0 !important;
            overflow: hidden !important;
            visibility: hidden !important;
            height: 0 !important;
          }
          .o_xs-center {
            text-align: center !important;
          }
          .o_xs-left {
            text-align: left !important;
          }
          .o_xs-right {
            text-align: left !important;
          }
          table.o_xs-left {
            margin-left: 0 !important;
            margin-right: auto !important;
            float: none !important;
          }
          table.o_xs-right {
            margin-left: auto !important;
            margin-right: 0 !important;
            float: none !important;
          }
          table.o_xs-center {
            margin-left: auto !important;
            margin-right: auto !important;
            float: none !important;
          }
          h1.o_heading {
            font-size: 32px !important;
            line-height: 41px !important;
          }
          h2.o_heading {
            font-size: 26px !important;
            line-height: 37px !important;
          }
          h3.o_heading {
            font-size: 20px !important;
            line-height: 30px !important;
          }
          .o_xs-py-md {
            padding-top: 24px !important;
            padding-bottom: 24px !important;
          }
          .o_xs-pt-xs {
            padding-top: 8px !important;
          }
          .o_xs-pb-xs {
            padding-bottom: 8px !important;
          }
        }
        @media screen {
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2)
                format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
              U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
          }
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2)
                format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
              U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
          }
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
          .o_sans,
          .o_heading {
            font-family: "Roboto", sans-serif !important;
          }
          .o_heading,
          strong,
          b {
            font-weight: 700 !important;
          }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
          }
        }
      </style>
    </head>
    <body
      class="o_body o_bg-light"
      style="
        width: 100%;
        margin: 0px;
        padding: 0px;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #dbe5ea;
      "
    >
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_hide"
              align="center"
              style="
                display: none;
                font-size: 0;
                max-height: 0;
                width: 0;
                line-height: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
              "
            >
              Email Summary (Hidden)
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
                padding-top: 32px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_re o_bg-dark o_px o_pb-md o_br-t"
                      align="center"
                      style="
                        font-size: 0;
                        vertical-align: top;
                        background-color: #fff;
                        border-radius: 4px 4px 0px 0px;
                        padding-left: 16px;
                        padding-right: 16px;
                        padding-bottom: 24px;
                      "
                    >
                      <div
                        class="o_col o_col-2"
                        style="
                          display: inline-block;
                          vertical-align: top;
                          width: 100%;
                          max-width: 200px;
                        "
                      >
                        <div
                          style="font-size: 24px; line-height: 24px; height: 24px"
                        >
                          &nbsp;
                        </div>
                        <div
                          class="o_px-xs o_sans o_text o_left o_xs-center"
                          style="
                            font-family: Helvetica, Arial, sans-serif;
                            margin-top: 0px;
                            margin-bottom: 0px;
                            font-size: 16px;
                            line-height: 24px;
                            text-align: left;
                            padding-left: 8px;
                            padding-right: 8px;
                          "
                        >
                          <p style="margin-top: 0px; margin-bottom: 0px">
                            <a
                              class="o_text-white"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #ffffff;
                              "
                              ><img
                                src="https://tangoeye.ai/wp-content/uploads/2021/06/tangoeye-logo.png"
                                width="136"
                                height="36"
                                alt="SimpleApp"
                                style="
                                  max-width: 136px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                "
                            /></a>
                          </p>
                        </div>
                      </div>
                      <div
                        class="o_col o_col-4"
                        style="
                          display: inline-block;
                          vertical-align: top;
                          width: 100%;
                          max-width: 400px;
                        "
                      >
                        <div
                          style="font-size: 22px; line-height: 22px; height: 22px"
                        >
                          &nbsp;
                        </div>
                        <div
                          class="o_px-xs"
                          style="padding-left: 8px; padding-right: 8px"
                        ></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-ultra_light o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-light"
                      align="center"
                      style="
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        font-size: 19px;
                        line-height: 28px;
                        background-color: #ebf5fa;
                        color: #82899a;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-top: 64px;
                        padding-bottom: 64px;
                      "
                    >
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="o_bb-primary"
                              height="40"
                              width="32"
                              style="border-bottom: 1px solid #126de5"
                            >
                              &nbsp;
                            </td>
                            <td
                              rowspan="2"
                              class="o_sans o_text o_text-secondary o_px o_py"
                              align="center"
                              style="
                                font-family: Helvetica, Arial, sans-serif;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                font-size: 16px;
                                line-height: 24px;
                                color: #424651;
                                padding-left: 16px;
                                padding-right: 16px;
                                padding-top: 16px;
                                padding-bottom: 16px;
                              "
                            >
                              <img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/check-48-primary.png"
                                width="48"
                                height="48"
                                alt=""
                                style="
                                  max-width: 48px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                "
                              />
                            </td>
                            <td
                              class="o_bb-primary"
                              height="40"
                              width="32"
                              style="border-bottom: 1px solid #126de5"
                            >
                              &nbsp;
                            </td>
                          </tr>
                          <tr>
                            <td height="40">&nbsp;</td>
                            <td height="40">&nbsp;</td>
                          </tr>
                          <tr>
                            <td
                              style="
                                font-size: 8px;
                                line-height: 8px;
                                height: 8px;
                              "
                            >
                              &nbsp;
                            </td>
                            <td
                              style="
                                font-size: 8px;
                                line-height: 8px;
                                height: 8px;
                              "
                            >
                              &nbsp;
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <h2
                        class="o_heading o_text-dark o_mb-xxs"
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-weight: bold;
                          margin-top: 0px;
                          margin-bottom: 4px;
                          color: #242b3d;
                          font-size: 30px;
                          line-height: 39px;
                        "
                      >
                        We are happy to welcome you aboard to Tangoeye.
                      </h2>
                      <br>
                      <p style="margin-top: 0px; margin-bottom: 0px">
                        You are few steps away from viewing your business intelligence dashboard, keep calm and Tangoooo!!!
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white"
                      style="
                        font-size: 24px;
                        line-height: 24px;
                        height: 24px;
                        background-color: #ffffff;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white o_px-md o_py o_sans o_text-xs o_text-light"
                      align="center"
                      style="
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        font-size: 14px;
                        line-height: 21px;
                        background-color: #ffffff;
                        color: #82899a;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-top: 5px;
                        padding-bottom: 0px;
                      "
                    >
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      ></table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white o_px-md o_py-xs"
                      align="center"
                      style="
                        background-color: #ffffff;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-top: 8px;
                        padding-bottom: 8px;
                      "
                    >
                      <table
                        align="center"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        role="presentation"
                      >
                        <tbody>
                          <tr>
                            <td
                              width="300"
                              class="o_btn o_bg-primary o_br o_heading o_text"
                              align="center"
                              style="
                                font-family: Helvetica, Arial, sans-serif;
                                font-weight: bold;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                font-size: 16px;
                                line-height: 24px;
                                mso-padding-alt: 12px 24px;
                                background-color: #126de5;
                                border-radius: 4px;
                              "
                            >
                              <a
                                class="o_text-white"
                                href=${data.url}
                                style="
                                  text-decoration: none;
                                  outline: none;
                                  color: #ffffff;
                                  display: block;
                                  padding: 12px 24px;
                                  mso-text-raise: 3px;
                                "
                                >Activate your Account</a
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
  
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white"
                      style="
                        font-size: 48px;
                        line-height: 48px;
                        height: 48px;
                        background-color: #ffffff;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
                padding-bottom: 32px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white o_br-b o_sans"
                      style="
                        font-size: 8px;
                        line-height: 8px;
                        height: 8px;
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        background-color: #ffffff;
                        border-radius: 0px 0px 4px 4px;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="o_re o_px o_pb-lg"
                      align="center"
                      style="
                        font-size: 0;
                        vertical-align: top;
                        padding-left: 16px;
                        padding-right: 16px;
                        background-color: #ffffff;
            
                      "
                    >
                      <div
                        class="o_col o_col-2 o_col-full"
                        style="
                          display: inline-block;
                          vertical-align: top;
                          width: 100%;
                          max-width: 200px;
                        "
                      >
                        <div
                          style="font-size: 24px; line-height: 24px; height: 24px"
                        >
                          &nbsp;
                        </div>
                        <div
                          class="o_px-xs o_sans o_text-xs o_center"
                          style="
                            font-family: Helvetica, Arial, sans-serif;
                            margin-top: -38px;
                            margin-bottom: 12px;
                            font-size: 14px;
                            line-height: 21px;
                            text-align: center;
                            padding-left: 8px;
                            padding-right: 8px;
                          "
                        >
                        <p style="margin-top: 0px; margin-bottom: 0px">
                        <a
                          class="o_text-light"
                          href="https://example.com/"
                          style="
                            text-decoration: none;
                            outline: none;
                            color: #82899a;
                          "
                          ><img
                            src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/facebook-light.png"
                            width="36"
                            height="36"
                            alt="fb"
                            style="
                              max-width: 36px;
                              -ms-interpolation-mode: bicubic;
                              vertical-align: middle;
                              border: 0;
                              line-height: 100%;
                              height: auto;
                              outline: none;
                              text-decoration: none;
                            " /></a
                        ><span> &nbsp;</span>
                        <a
                          class="o_text-light"
                          href="https://example.com/"
                          style="
                            text-decoration: none;
                            outline: none;
                            color: #82899a;
                          "
                          ><img
                            src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/twitter-light.png"
                            width="36"
                            height="36"
                            alt="tw"
                            style="
                              max-width: 36px;
                              -ms-interpolation-mode: bicubic;
                              vertical-align: middle;
                              border: 0;
                              line-height: 100%;
                              height: auto;
                              outline: none;
                              text-decoration: none;
                            " /></a
                        ><span> &nbsp;</span>
                        <a
                          class="o_text-light"
                          href="https://example.com/"
                          style="
                            text-decoration: none;
                            outline: none;
                            color: #82899a;
                          "
                          ><img
                            src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/instagram-light.png"
                            width="36"
                            height="36"
                            alt="ig"
                            style="
                              max-width: 36px;
                              -ms-interpolation-mode: bicubic;
                              vertical-align: middle;
                              border: 0;
                              line-height: 100%;
                              height: auto;
                              outline: none;
                              text-decoration: none;
                            " /></a
                        ><span> &nbsp;</span>
                      </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="o_px-md o_pb-lg o_sans o_text-xs o_text-light"
                      align="center"
                      style="
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        font-size: 14px;
                        line-height: 21px;
                        color: #82899a;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-bottom: 32px;
                        background-color: #ffffff;
                      "
                    >
                      <p
                        class="o_mb-xs"
                        style="margin-top: 0px; margin-bottom: 8px"
                      >
                        ©2021 TangoEye<br />
                        Our Headquarters: 603, Anna Salai, <br />
                        Kannammai Building, First Floor,<br />
                        Chennai-600 006
                      </p>
                      <p style="margin-top: 0px; margin-bottom: 0px">
                        <a
                          class="o_text-xxs o_underline"
                          href="https://tangoeye.ai/"
                          style="
                            text-decoration: underline;
                            outline: none;
                            font-size: 12px;
                            line-height: 19px;
                            color: #a0a3ab;
                          "
                          >https://tangoeye.ai/</a
                        >
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
  
              <div
                class="o_hide-xs"
                style="font-size: 64px; line-height: 64px; height: 64px"
              >
                &nbsp;
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  `;

  return aws.sendEmail(data.email, subject, template);
};

module.exports.sendStorePairedDetails = (data) => {
  const subject = "Tango Eye - Pairing initiated.";
  const template = `
        Your store pairing is initiated. please cleck below link to download TangoEye app. appId:'${data.appId}'
        \n
        \n
        Click <a href='https://drive.google.com/file/d/1bhfWy5CJpMuYdrW6QwtSW7S8_xpRQzB6/view?usp=sharing'>Download TangoEye app.</a>
    `;
  return aws.sendEmail(data.email, subject, template);
};

module.exports.sendSignUpEmailOTP = (data) => {
  const subject = "Welcome to Tango Eye | Please verify your email address";
  const template = `<!doctype html>
  <html lang="en">
     <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Signup Verification</title>
        <style type="text/css">
           a { text-decoration: none; outline: none; }
           @media (max-width: 649px) {
           .o_col-full { max-width: 100% !important; }
           .o_col-half { max-width: 50% !important; }
           .o_hide-lg { display: inline-block !important; font-size: inherit !important; max-height: none !important; line-height: inherit !important; overflow: visible !important; width: auto !important; visibility: visible !important; }
           .o_hide-xs, .o_hide-xs.o_col_i { display: none !important; font-size: 0 !important; max-height: 0 !important; width: 0 !important; line-height: 0 !important; overflow: hidden !important; visibility: hidden !important; height: 0 !important; }
           .o_xs-center { text-align: center !important; }
           .o_xs-left { text-align: left !important; }
           .o_xs-right { text-align: left !important; }
           table.o_xs-left { margin-left: 0 !important; margin-right: auto !important; float: none !important; }
           table.o_xs-right { margin-left: auto !important; margin-right: 0 !important; float: none !important; }
           table.o_xs-center { margin-left: auto !important; margin-right: auto !important; float: none !important; }
           h1.o_heading { font-size: 32px !important; line-height: 41px !important; }
           h2.o_heading { font-size: 26px !important; line-height: 37px !important; }
           h3.o_heading { font-size: 20px !important; line-height: 30px !important; }
           .o_xs-py-md { padding-top: 24px !important; padding-bottom: 24px !important; }
           .o_xs-pt-xs { padding-top: 8px !important; }
           .o_xs-pb-xs { padding-bottom: 8px !important; }
           }
           @media screen {
           @font-face {
           font-family: 'Roboto';
           font-style: normal;
           font-weight: 400;
           src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format("woff2");
           unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
           @font-face {
           font-family: 'Roboto';
           font-style: normal;
           font-weight: 400;
           src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format("woff2");
           unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
           @font-face {
           font-family: 'Roboto';
           font-style: normal;
           font-weight: 700;
           src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format("woff2");
           unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
           @font-face {
           font-family: 'Roboto';
           font-style: normal;
           font-weight: 700;
           src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format("woff2");
           unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
           .o_sans, .o_heading { font-family: "Roboto", sans-serif !important; }
           .o_heading, strong, b { font-weight: 700 !important; }
           a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
           }
        </style>
        <!--[if mso]>
        <style>
           table { border-collapse: collapse; }
           .o_col { float: left; }
        </style>
        <xml>
           <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
     </head>
     <body class="o_body o_bg-light" style="width: 100%;margin: 0px;padding: 0px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;background-color: #dbe5ea;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_hide" align="center" style="display: none;font-size: 0;max-height: 0;width: 0;line-height: 0;overflow: hidden;mso-hide: all;visibility: hidden;">Email Summary (Hidden)</td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-top: 32px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_re o_bg-dark o_px o_pb-md o_br-t" align="center" style="font-size: 0;vertical-align: top;background-color: #fff;border-radius: 4px 4px 0px 0px;padding-left: 16px;padding-right: 16px;padding-bottom: 24px;">
                                <div class="o_col o_col-2" style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px;">
                                   <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                                   <div class="o_px-xs o_sans o_text o_left o_xs-center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;text-align: left;padding-left: 8px;padding-right: 8px;">
                                      <p style="margin-top: 0px;margin-bottom: 0px;"><a class="o_text-white" href="https://example.com/" style="text-decoration: none;outline: none;color: #ffffff;"><img src="https://tangoeye.ai/wp-content/uploads/2021/06/tangoeye-logo.png" width="136" height="36" alt="SimpleApp" style="max-width: 136px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a></p>
                                   </div>
                                </div>
                                <div class="o_col o_col-4" style="display: inline-block;vertical-align: top;width: 100%;max-width: 400px;">
                                   <div style="font-size: 22px; line-height: 22px; height: 22px;">&nbsp; </div>
                                   <div class="o_px-xs" style="padding-left: 8px;padding-right: 8px;">
                                   </div>
                                </div>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-primary o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-white" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #126de5;color: #ffffff;padding-left: 24px;padding-right: 24px;padding-top: 64px;padding-bottom: 64px;">
                                <table cellspacing="0" cellpadding="0" border="0" role="presentation">
                                </table>
                                <h2 class="o_heading o_mb-xxs" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 4px;font-size: 30px;line-height: 39px;">Sign Up OTP Verification</h2>
                                <p style="margin-top: 0px;margin-bottom: 0px;">Before you get started with your new account you'll need to confirm that <b>${data.email}</b> is your email address. Please use this below OTP to verify your account.</p>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-white" style="font-size: 48px;line-height: 48px;height: 48px;background-color: #ffffff;">&nbsp; </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-white o_px-md o_py o_sans o_text-xs o_text-light" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;background-color: #ffffff;color: #82899a;padding-left: 24px;padding-right: 24px;padding-top: 16px;padding-bottom: 16px;">
                                <p class="o_mb" style="margin-top: 0px;margin-bottom: 16px;"><strong>Here is Your One Time Verification Code</strong></p>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                   <tbody>
                                      <tr>
                                         <td width="384" class="o_bg-ultra_light o_br o_text-md o_sans o_px-xs o_py-md" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #ebf5fa;border-radius: 4px;padding-left: 8px;padding-right: 8px;padding-top: 24px;padding-bottom: 24px;">
                                            <p class="o_text-dark" style="color: #242b3d;margin-top: 0px;margin-bottom: 0px;"><strong> ${data.otp} </strong></p>
                                         </td>
                                      </tr>
                                   </tbody>
                                </table>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-white" style="font-size: 24px;line-height: 24px;height: 24px;background-color: #ffffff;">&nbsp; </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-white o_px-md o_py" align="left" style="background-color: #ffffff;padding-left: 24px;padding-right: 24px;padding-top: 16px;padding-bottom: 16px;">
                                <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                                   <tbody>
                                      <tr>
                                         <td width="40" class="o_bg-dark o_br-l o_text-md o_text-white o_sans o_py-xs" align="right" style="vertical-align: top;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #242b3d;color: #ffffff;border-radius: 4px 0px 0px 4px;padding-top: 8px;padding-bottom: 8px;">
                                            <img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/warning-24-white.png" width="24" height="24" alt="" style="max-width: 24px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;">
                                         </td>
                                         <td class="o_bg-dark o_br-r o_text-xs o_text-white o_sans o_px o_py-xs" align="left" style="vertical-align: top;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;background-color: #242b3d;color: #ffffff;border-radius: 0px 4px 4px 0px;padding-left: 16px;padding-right: 16px;padding-top: 8px;padding-bottom: 8px;">
                                            <p style="margin-top: 0px;margin-bottom: 0px;"><strong>Information.</strong></p>
                                         </td>
                                      </tr>
                                   </tbody>
                                </table>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-white" style="font-size: 24px;line-height: 24px;height: 24px;background-color: #ffffff;">&nbsp; </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
           <tbody>
              <tr>
                 <td class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-bottom: 32px;">
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                       <tbody>
                          <tr>
                             <td class="o_bg-white o_br-b o_sans" style="font-size: 8px;line-height: 8px;height: 8px;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;background-color: #ffffff;border-radius: 0px 0px 4px 4px;">&nbsp; </td>
                          </tr>
                          <tr>
                             <td class="o_re o_px o_pb-lg" align="center" style="font-size: 0;vertical-align: top;padding-left: 16px;padding-right: 16px; background-color: #ffffff; color:">
                                <div class="o_col o_col-2 o_col-full" style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px; ">
                                   <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                                   <div class="o_px-xs o_sans o_text-xs o_center" style="font-family: Helvetica, Arial, sans-serif;margin-top: -38px;
                                      margin-bottom: 12px;font-size: 14px;line-height: 21px;text-align: center;padding-left: 8px;padding-right: 8px;">
                                      <p style="margin-top: 0px;margin-bottom: 0px;">
                                         <a class="o_text-light" href="https://example.com/" style="text-decoration: none;outline: none;color: #82899a;"><img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/facebook-light.png" width="36" height="36" alt="fb" style="max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a><span> &nbsp;</span>
                                         <a class="o_text-light" href="https://example.com/" style="text-decoration: none;outline: none;color: #82899a;"><img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/twitter-light.png" width="36" height="36" alt="tw" style="max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a><span> &nbsp;</span>
                                         <a class="o_text-light" href="https://example.com/" style="text-decoration: none;outline: none;color: #82899a;"><img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/instagram-light.png" width="36" height="36" alt="ig" style="max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a><span> &nbsp;</span>
                                      </p>
                                   </div>
                                </div>
                             </td>
                          </tr>
                          <tr>
                             <td class="o_px-md o_pb-lg o_sans o_text-xs o_text-light" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;color: #82899a;padding-left: 24px;padding-right: 24px;padding-bottom: 32px; background-color: #ffffff;">
                                <p class="o_mb-xs" style="margin-top: 0px;margin-bottom: 8px;">©2021 TangoEye<br>
                                   Our Headquarters: 603, Anna Salai, <br>
                                   Kannammai Building, First Floor,<br>
                                   Chennai-600 006
                                </p>
                                <p style="margin-top: 0px;margin-bottom: 0px;">
                                   <a class="o_text-xxs  o_underline" href="https://tangoeye.ai/" style="text-decoration: underline;outline: none;font-size: 12px;line-height: 19px;color: #a0a3ab;">https://tangoeye.ai/</a>
                                </p>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                    <div class="o_hide-xs" style="font-size: 64px; line-height: 64px; height: 64px;">&nbsp; </div>
                 </td>
              </tr>
           </tbody>
        </table>
     </body>
  </html>`;

  return aws.sendEmail(data.email, subject, template);
};

module.exports.newClientRegistertoAdmin = (data) => {
  const subject = "Retail App | New Client Registered";
  const template = `<!DOCTYPE html>
  <html lang="en">
     <head>
        <meta charset="utf-8" />
        <meta
           name="viewport"
           content="width=device-width, initial-scale=1, shrink-to-fit=no"
           />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>New Client Intimation</title>
        <style type="text/css">
           a {
           text-decoration: none;
           outline: none;
           }
           @media (max-width: 649px) {
           .o_col-full {
           max-width: 100% !important;
           }
           .o_col-half {
           max-width: 50% !important;
           }
           .o_hide-lg {
           display: inline-block !important;
           font-size: inherit !important;
           max-height: none !important;
           line-height: inherit !important;
           overflow: visible !important;
           width: auto !important;
           visibility: visible !important;
           }
           .o_hide-xs,
           .o_hide-xs.o_col_i {
           display: none !important;
           font-size: 0 !important;
           max-height: 0 !important;
           width: 0 !important;
           line-height: 0 !important;
           overflow: hidden !important;
           visibility: hidden !important;
           height: 0 !important;
           }
           .o_xs-center {
           text-align: center !important;
           }
           .o_xs-left {
           text-align: left !important;
           }
           .o_xs-right {
           text-align: left !important;
           }
           table.o_xs-left {
           margin-left: 0 !important;
           margin-right: auto !important;
           float: none !important;
           }
           table.o_xs-right {
           margin-left: auto !important;
           margin-right: 0 !important;
           float: none !important;
           }
           table.o_xs-center {
           margin-left: auto !important;
           margin-right: auto !important;
           float: none !important;
           }
           h1.o_heading {
           font-size: 32px !important;
           line-height: 41px !important;
           }
           h2.o_heading {
           font-size: 26px !important;
           line-height: 37px !important;
           }
           h3.o_heading {
           font-size: 20px !important;
           line-height: 30px !important;
           }
           .o_xs-py-md {
           padding-top: 24px !important;
           padding-bottom: 24px !important;
           }
           .o_xs-pt-xs {
           padding-top: 8px !important;
           }
           .o_xs-pb-xs {
           padding-bottom: 8px !important;
           }
           }
           @media screen {
           @font-face {
           font-family: "Roboto";
           font-style: normal;
           font-weight: 400;
           src: local("Roboto"), local("Roboto-Regular"),
           url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2)
           format("woff2");
           unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
           U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
           }
           @font-face {
           font-family: "Roboto";
           font-style: normal;
           font-weight: 400;
           src: local("Roboto"), local("Roboto-Regular"),
           url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2)
           format("woff2");
           unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
           U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
           U+2212, U+2215, U+FEFF, U+FFFD;
           }
           @font-face {
           font-family: "Roboto";
           font-style: normal;
           font-weight: 700;
           src: local("Roboto Bold"), local("Roboto-Bold"),
           url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2)
           format("woff2");
           unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
           U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
           }
           @font-face {
           font-family: "Roboto";
           font-style: normal;
           font-weight: 700;
           src: local("Roboto Bold"), local("Roboto-Bold"),
           url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2)
           format("woff2");
           unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
           U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
           U+2212, U+2215, U+FEFF, U+FFFD;
           }
           .o_sans,
           .o_heading {
           font-family: "Roboto", sans-serif !important;
           }
           .o_heading,
           strong,
           b {
           font-weight: 700 !important;
           }
           a[x-apple-data-detectors] {
           color: inherit !important;
           text-decoration: none !important;
           }
           }
        </style>
     </head>
     <body
        class="o_body o_bg-light"
        style="
        width: 100%;
        margin: 0px;
        padding: 0px;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #dbe5ea;
        "
        >
        <table
           width="100%"
           cellspacing="0"
           cellpadding="0"
           border="0"
           role="presentation"
           >
           <tbody>
              <tr>
                 <td
                    class="o_hide"
                    align="center"
                    style="
                    display: none;
                    font-size: 0;
                    max-height: 0;
                    width: 0;
                    line-height: 0;
                    overflow: hidden;
                    mso-hide: all;
                    visibility: hidden;
                    "
                    >
                    Email Summary (Hidden)
                 </td>
              </tr>
           </tbody>
        </table>
        <table
           width="100%"
           cellspacing="0"
           cellpadding="0"
           border="0"
           role="presentation"
           >
           <tbody>
              <tr>
                 <td
                    class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs"
                    align="center"
                    style="
                    background-color: #dbe5ea;
                    padding-left: 8px;
                    padding-right: 8px;
                    padding-top: 32px;
                    "
                    >
                    <table
                       class="o_block"
                       width="100%"
                       cellspacing="0"
                       cellpadding="0"
                       border="0"
                       role="presentation"
                       style="max-width: 632px; margin: 0 auto"
                       >
                       <tbody>
                          <tr>
                             <td
                                class="o_re o_bg-dark o_px o_pb-md o_br-t"
                                align="center"
                                style="
                                font-size: 0;
                                vertical-align: top;
                                background-color: #fff;
                                border-radius: 4px 4px 0px 0px;
                                padding-left: 16px;
                                padding-right: 16px;
                                padding-bottom: 24px;
                                "
                                >
                                <div
                                   class="o_col o_col-2"
                                   style="
                                   display: inline-block;
                                   vertical-align: top;
                                   width: 100%;
                                   max-width: 200px;
                                   "
                                   >
                                   <div
                                      style="font-size: 24px; line-height: 24px; height: 24px"
                                      >
                                      &nbsp;
                                   </div>
                                   <div
                                      class="o_px-xs o_sans o_text o_left o_xs-center"
                                      style="
                                      font-family: Helvetica, Arial, sans-serif;
                                      margin-top: 0px;
                                      margin-bottom: 0px;
                                      font-size: 16px;
                                      line-height: 24px;
                                      text-align: left;
                                      padding-left: 8px;
                                      padding-right: 8px;
                                      "
                                      >
                                      <p style="margin-top: 0px; margin-bottom: 0px">
                                         <a
                                            class="o_text-white"
                                            href="https://example.com/"
                                            style="
                                            text-decoration: none;
                                            outline: none;
                                            color: #ffffff;
                                            "
                                            ><img
                                            src="https://tangoeye.ai/wp-content/uploads/2021/06/tangoeye-logo.png"
                                            width="136"
                                            height="36"
                                            alt="SimpleApp"
                                            style="
                                            max-width: 136px;
                                            -ms-interpolation-mode: bicubic;
                                            vertical-align: middle;
                                            border: 0;
                                            line-height: 100%;
                                            height: auto;
                                            outline: none;
                                            text-decoration: none;
                                            "
                                            /></a>
                                      </p>
                                   </div>
                                </div>
                                <div
                                   class="o_col o_col-4"
                                   style="
                                   display: inline-block;
                                   vertical-align: top;
                                   width: 100%;
                                   max-width: 400px;
                                   "
                                   >
                                   <div
                                      style="font-size: 22px; line-height: 22px; height: 22px"
                                      >
                                      &nbsp;
                                   </div>
                                   <div
                                      class="o_px-xs"
                                      style="padding-left: 8px; padding-right: 8px"
                                      ></div>
                                </div>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table
           width="100%"
           cellspacing="0"
           cellpadding="0"
           border="0"
           role="presentation"
           >
           <tbody>
              <tr>
                 <td
                    class="o_bg-light o_px-xs"
                    align="center"
                    style="
                    background-color: #dbe5ea;
                    padding-left: 8px;
                    padding-right: 8px;
                    "
                    >
                    <table
                       class="o_block"
                       width="100%"
                       cellspacing="0"
                       cellpadding="0"
                       border="0"
                       role="presentation"
                       style="max-width: 632px; margin: 0 auto"
                       >
                       <tbody>
                          <tr>
                             <td
                                class="o_bg-ultra_light o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-light"
                                align="center"
                                style="
                                font-family: Helvetica, Arial, sans-serif;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                font-size: 19px;
                                line-height: 28px;
                                background-color: #ebf5fa;
                                color: #82899a;
                                padding-left: 24px;
                                padding-right: 24px;
                                padding-top: 64px;
                                padding-bottom: 64px;
                                "
                                >
                                <table
                                   role="presentation"
                                   cellspacing="0"
                                   cellpadding="0"
                                   border="0"
                                   >
                                   <tbody>
                                      <tr>
                                         <td
                                            class="o_bb-primary"
                                            height="40"
                                            width="32"
                                            style="border-bottom: 1px solid #126de5"
                                            >
                                            &nbsp;
                                         </td>
                                         <td
                                            rowspan="2"
                                            class="o_sans o_text o_text-secondary o_px o_py"
                                            align="center"
                                            style="
                                            font-family: Helvetica, Arial, sans-serif;
                                            margin-top: 0px;
                                            margin-bottom: 0px;
                                            font-size: 16px;
                                            line-height: 24px;
                                            color: #424651;
                                            padding-left: 16px;
                                            padding-right: 16px;
                                            padding-top: 16px;
                                            padding-bottom: 16px;
                                            "
                                            >
                                            <img
                                               src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/check-48-primary.png"
                                               width="48"
                                               height="48"
                                               alt=""
                                               style="
                                               max-width: 48px;
                                               -ms-interpolation-mode: bicubic;
                                               vertical-align: middle;
                                               border: 0;
                                               line-height: 100%;
                                               height: auto;
                                               outline: none;
                                               text-decoration: none;
                                               "
                                               />
                                         </td>
                                         <td
                                            class="o_bb-primary"
                                            height="40"
                                            width="32"
                                            style="border-bottom: 1px solid #126de5"
                                            >
                                            &nbsp;
                                         </td>
                                      </tr>
                                      <tr>
                                         <td height="40">&nbsp;</td>
                                         <td height="40">&nbsp;</td>
                                      </tr>
                                      <tr>
                                         <td
                                            style="
                                            font-size: 8px;
                                            line-height: 8px;
                                            height: 8px;
                                            "
                                            >
                                            &nbsp;
                                         </td>
                                         <td
                                            style="
                                            font-size: 8px;
                                            line-height: 8px;
                                            height: 8px;
                                            "
                                            >
                                            &nbsp;
                                         </td>
                                      </tr>
                                   </tbody>
                                </table>
                                <h2
                                   class="o_heading o_text-dark o_mb-xxs"
                                   style="
                                   font-family: Helvetica, Arial, sans-serif;
                                   font-weight: bold;
                                   margin-top: 0px;
                                   margin-bottom: 4px;
                                   color: #242b3d;
                                   font-size: 30px;
                                   line-height: 39px;
                                   "
                                   >
                                   Alert! New User has Just Signed Up.
                                </h2>
                                <br>
                                <p style="margin-top: 0px; margin-bottom: 0px">
                                   Client Name : ${data.name},
                                   <br>
                                   Phone Number : +91 ${data.phone}
                                   <br>
                                   Email Id : ${data.email}
                                </p>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table
           width="100%"
           cellspacing="0"
           cellpadding="0"
           border="0"
           role="presentation"
           >
           <tbody>
              <tr>
                 <td
                    class="o_bg-light o_px-xs"
                    align="center"
                    style="
                    background-color: #dbe5ea;
                    padding-left: 8px;
                    padding-right: 8px;
                    "
                    >
                    <table
                       class="o_block"
                       width="100%"
                       cellspacing="0"
                       cellpadding="0"
                       border="0"
                       role="presentation"
                       style="max-width: 632px; margin: 0 auto"
                       >
                       <tbody>
                          <tr>
                             <td
                                class="o_bg-white"
                                style="
                                font-size: 24px;
                                line-height: 24px;
                                height: 24px;
                                background-color: #ffffff;
                                "
                                >
                                &nbsp;
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table
           width="100%"
           cellspacing="0"
           cellpadding="0"
           border="0"
           role="presentation"
           >
           <tbody>
              <tr>
                 <td
                    class="o_bg-light o_px-xs"
                    align="center"
                    style="
                    background-color: #dbe5ea;
                    padding-left: 8px;
                    padding-right: 8px;
                    "
                    >
                    <table
                       class="o_block"
                       width="100%"
                       cellspacing="0"
                       cellpadding="0"
                       border="0"
                       role="presentation"
                       style="max-width: 632px; margin: 0 auto"
                       >
                       <tbody>
                          <tr>
                             <td
                                class="o_bg-white o_px-md o_py o_sans o_text-xs o_text-light"
                                align="center"
                                style="
                                font-family: Helvetica, Arial, sans-serif;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                font-size: 14px;
                                line-height: 21px;
                                background-color: #ffffff;
                                color: #82899a;
                                padding-left: 24px;
                                padding-right: 24px;
                                padding-top: 5px;
                                padding-bottom: 0px;
                                "
                                >
                                <table
                                   role="presentation"
                                   cellspacing="0"
                                   cellpadding="0"
                                   border="0"
                                   ></table>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table
           width="100%"
           cellspacing="0"
           cellpadding="0"
           border="0"
           role="presentation"
           >
           <tbody>
              <tr>
                 <td
                    class="o_bg-light o_px-xs"
                    align="center"
                    style="
                    background-color: #dbe5ea;
                    padding-left: 8px;
                    padding-right: 8px;
                    "
                    >
                    <table
                       class="o_block"
                       width="100%"
                       cellspacing="0"
                       cellpadding="0"
                       border="0"
                       role="presentation"
                       style="max-width: 632px; margin: 0 auto"
                       >
                       <tbody>
                          <tr>
                             <td
                                class="o_bg-white o_px-md o_py-xs"
                                align="center"
                                style="
                                background-color: #ffffff;
                                padding-left: 24px;
                                padding-right: 24px;
                                padding-top: 8px;
                                padding-bottom: 8px;
                                "
                                >
                                <table
                                   align="center"
                                   cellspacing="0"
                                   cellpadding="0"
                                   border="0"
                                   role="presentation"
                                   >
                                   <tbody>
                                      <tr>
                                         <td
                                            width="300"
                                            class="o_btn o_bg-primary o_br o_heading o_text"
                                            align="center"
                                            style="
                                            font-family: Helvetica, Arial, sans-serif;
                                            font-weight: bold;
                                            margin-top: 0px;
                                            margin-bottom: 0px;
                                            font-size: 16px;
                                            line-height: 24px;
                                            mso-padding-alt: 12px 24px;
                                            background-color: #126de5;
                                            border-radius: 4px;
                                            "
                                            >
                                            <a
                                               class="o_text-white"
                                               href="${data.uiDomainName}"
                                               style="
                                               text-decoration: none;
                                               outline: none;
                                               color: #ffffff;
                                               display: block;
                                               padding: 12px 24px;
                                               mso-text-raise: 3px;
                                               "
                                               >Redirect to my Dashboard</a
                                               >
                                         </td>
                                      </tr>
                                   </tbody>
                                </table>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table
           width="100%"
           cellspacing="0"
           cellpadding="0"
           border="0"
           role="presentation"
           >
           <tbody>
              <tr>
                 <td
                    class="o_bg-light o_px-xs"
                    align="center"
                    style="
                    background-color: #dbe5ea;
                    padding-left: 8px;
                    padding-right: 8px;
                    "
                    >
                    <table
                       class="o_block"
                       width="100%"
                       cellspacing="0"
                       cellpadding="0"
                       border="0"
                       role="presentation"
                       style="max-width: 632px; margin: 0 auto"
                       >
                       <tbody>
                          <tr>
                             <td
                                class="o_bg-white"
                                style="
                                font-size: 48px;
                                line-height: 48px;
                                height: 48px;
                                background-color: #ffffff;
                                "
                                >
                                &nbsp;
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
        <table
           width="100%"
           cellspacing="0"
           cellpadding="0"
           border="0"
           role="presentation"
           >
           <tbody>
              <tr>
                 <td
                    class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs"
                    align="center"
                    style="
                    background-color: #dbe5ea;
                    padding-left: 8px;
                    padding-right: 8px;
                    padding-bottom: 32px;
                    "
                    >
                    <table
                       class="o_block"
                       width="100%"
                       cellspacing="0"
                       cellpadding="0"
                       border="0"
                       role="presentation"
                       style="max-width: 632px; margin: 0 auto"
                       >
                       <tbody>
                          <tr>
                             <td
                                class="o_bg-white o_br-b o_sans"
                                style="
                                font-size: 8px;
                                line-height: 8px;
                                height: 8px;
                                font-family: Helvetica, Arial, sans-serif;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                background-color: #ffffff;
                                border-radius: 0px 0px 4px 4px;
                                "
                                >
                                &nbsp;
                             </td>
                          </tr>
                          <tr>
                             <td
                                class="o_re o_px o_pb-lg"
                                align="center"
                                style="
                                font-size: 0;
                                vertical-align: top;
                                padding-left: 16px;
                                padding-right: 16px;
                                background-color: #ffffff;
                                "
                                >
                                <div
                                   class="o_col o_col-2 o_col-full"
                                   style="
                                   display: inline-block;
                                   vertical-align: top;
                                   width: 100%;
                                   max-width: 200px;
                                   "
                                   >
                                   <div
                                      style="font-size: 24px; line-height: 24px; height: 24px"
                                      >
                                      &nbsp;
                                   </div>
                                   <div
                                      class="o_px-xs o_sans o_text-xs o_center"
                                      style="
                                      font-family: Helvetica, Arial, sans-serif;
                                      margin-top: -38px;
                                      margin-bottom: 12px;
                                      font-size: 14px;
                                      line-height: 21px;
                                      text-align: center;
                                      padding-left: 8px;
                                      padding-right: 8px;
                                      "
                                      >
                                      <p style="margin-top: 0px; margin-bottom: 0px">
                                         <a
                                            class="o_text-light"
                                            href="https://example.com/"
                                            style="
                                            text-decoration: none;
                                            outline: none;
                                            color: #82899a;
                                            "
                                            ><img
                                            src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/facebook-light.png"
                                            width="36"
                                            height="36"
                                            alt="fb"
                                            style="
                                            max-width: 36px;
                                            -ms-interpolation-mode: bicubic;
                                            vertical-align: middle;
                                            border: 0;
                                            line-height: 100%;
                                            height: auto;
                                            outline: none;
                                            text-decoration: none;
                                            " /></a
                                            ><span> &nbsp;</span>
                                         <a
                                            class="o_text-light"
                                            href="https://example.com/"
                                            style="
                                            text-decoration: none;
                                            outline: none;
                                            color: #82899a;
                                            "
                                            ><img
                                            src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/twitter-light.png"
                                            width="36"
                                            height="36"
                                            alt="tw"
                                            style="
                                            max-width: 36px;
                                            -ms-interpolation-mode: bicubic;
                                            vertical-align: middle;
                                            border: 0;
                                            line-height: 100%;
                                            height: auto;
                                            outline: none;
                                            text-decoration: none;
                                            " /></a
                                            ><span> &nbsp;</span>
                                         <a
                                            class="o_text-light"
                                            href="https://example.com/"
                                            style="
                                            text-decoration: none;
                                            outline: none;
                                            color: #82899a;
                                            "
                                            ><img
                                            src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/instagram-light.png"
                                            width="36"
                                            height="36"
                                            alt="ig"
                                            style="
                                            max-width: 36px;
                                            -ms-interpolation-mode: bicubic;
                                            vertical-align: middle;
                                            border: 0;
                                            line-height: 100%;
                                            height: auto;
                                            outline: none;
                                            text-decoration: none;
                                            " /></a
                                            ><span> &nbsp;</span>
                                      </p>
                                   </div>
                                </div>
                             </td>
                          </tr>
                          <tr>
                             <td
                                class="o_px-md o_pb-lg o_sans o_text-xs o_text-light"
                                align="center"
                                style="
                                font-family: Helvetica, Arial, sans-serif;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                font-size: 14px;
                                line-height: 21px;
                                color: #82899a;
                                padding-left: 24px;
                                padding-right: 24px;
                                padding-bottom: 32px;
                                background-color: #ffffff;
                                "
                                >
                                <p
                                   class="o_mb-xs"
                                   style="margin-top: 0px; margin-bottom: 8px"
                                   >
                                   ©2021 TangoEye<br />
                                   Our Headquarters: 603, Anna Salai, <br />
                                   Kannammai Building, First Floor,<br />
                                   Chennai-600 006
                                </p>
                                <p style="margin-top: 0px; margin-bottom: 0px">
                                   <a
                                      class="o_text-xxs o_underline"
                                      href="https://tangoeye.ai/"
                                      style="
                                      text-decoration: underline;
                                      outline: none;
                                      font-size: 12px;
                                      line-height: 19px;
                                      color: #a0a3ab;
                                      "
                                      >https://tangoeye.ai/</a
                                      >
                                </p>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                    <div
                       class="o_hide-xs"
                       style="font-size: 64px; line-height: 64px; height: 64px"
                       >
                       &nbsp;
                    </div>
                 </td>
              </tr>
           </tbody>
        </table>
     </body>
  </html>`;

  return aws.sendEmail('testtangoeye007@gmail.com', subject, template);
};

module.exports.newClientRegister = (data) => {
  const subject = "Tango Eye |Your account has been successfully created";
  const template = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="x-apple-disable-message-reformatting" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Client Verified</title>
      <style type="text/css">
        a {
          text-decoration: none;
          outline: none;
        }
        @media (max-width: 649px) {
          .o_col-full {
            max-width: 100% !important;
          }
          .o_col-half {
            max-width: 50% !important;
          }
          .o_hide-lg {
            display: inline-block !important;
            font-size: inherit !important;
            max-height: none !important;
            line-height: inherit !important;
            overflow: visible !important;
            width: auto !important;
            visibility: visible !important;
          }
          .o_hide-xs,
          .o_hide-xs.o_col_i {
            display: none !important;
            font-size: 0 !important;
            max-height: 0 !important;
            width: 0 !important;
            line-height: 0 !important;
            overflow: hidden !important;
            visibility: hidden !important;
            height: 0 !important;
          }
          .o_xs-center {
            text-align: center !important;
          }
          .o_xs-left {
            text-align: left !important;
          }
          .o_xs-right {
            text-align: left !important;
          }
          table.o_xs-left {
            margin-left: 0 !important;
            margin-right: auto !important;
            float: none !important;
          }
          table.o_xs-right {
            margin-left: auto !important;
            margin-right: 0 !important;
            float: none !important;
          }
          table.o_xs-center {
            margin-left: auto !important;
            margin-right: auto !important;
            float: none !important;
          }
          h1.o_heading {
            font-size: 32px !important;
            line-height: 41px !important;
          }
          h2.o_heading {
            font-size: 26px !important;
            line-height: 37px !important;
          }
          h3.o_heading {
            font-size: 20px !important;
            line-height: 30px !important;
          }
          .o_xs-py-md {
            padding-top: 24px !important;
            padding-bottom: 24px !important;
          }
          .o_xs-pt-xs {
            padding-top: 8px !important;
          }
          .o_xs-pb-xs {
            padding-bottom: 8px !important;
          }
        }
        @media screen {
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2)
                format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
              U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
          }
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2)
                format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
              U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
          }
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
          .o_sans,
          .o_heading {
            font-family: "Roboto", sans-serif !important;
          }
          .o_heading,
          strong,
          b {
            font-weight: 700 !important;
          }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
          }
        }
      </style>
    </head>
    <body
      class="o_body o_bg-light"
      style="
        width: 100%;
        margin: 0px;
        padding: 0px;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #dbe5ea;
      "
    >
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_hide"
              align="center"
              style="
                display: none;
                font-size: 0;
                max-height: 0;
                width: 0;
                line-height: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
              "
            >
              Email Summary (Hidden)
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
                padding-top: 32px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_re o_bg-dark o_px o_pb-md o_br-t"
                      align="center"
                      style="
                        font-size: 0;
                        vertical-align: top;
                        background-color: #fff;
                        border-radius: 4px 4px 0px 0px;
                        padding-left: 16px;
                        padding-right: 16px;
                        padding-bottom: 24px;
                      "
                    >
                      <div
                        class="o_col o_col-2"
                        style="
                          display: inline-block;
                          vertical-align: top;
                          width: 100%;
                          max-width: 200px;
                        "
                      >
                        <div
                          style="font-size: 24px; line-height: 24px; height: 24px"
                        >
                          &nbsp;
                        </div>
                        <div
                          class="o_px-xs o_sans o_text o_left o_xs-center"
                          style="
                            font-family: Helvetica, Arial, sans-serif;
                            margin-top: 0px;
                            margin-bottom: 0px;
                            font-size: 16px;
                            line-height: 24px;
                            text-align: left;
                            padding-left: 8px;
                            padding-right: 8px;
                          "
                        >
                          <p style="margin-top: 0px; margin-bottom: 0px">
                            <a
                              class="o_text-white"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #ffffff;
                              "
                              ><img
                                src="https://tangoeye.ai/wp-content/uploads/2021/06/tangoeye-logo.png"
                                width="136"
                                height="36"
                                alt="SimpleApp"
                                style="
                                  max-width: 136px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                "
                            /></a>
                          </p>
                        </div>
                      </div>
                      <div
                        class="o_col o_col-4"
                        style="
                          display: inline-block;
                          vertical-align: top;
                          width: 100%;
                          max-width: 400px;
                        "
                      >
                        <div
                          style="font-size: 22px; line-height: 22px; height: 22px"
                        >
                          &nbsp;
                        </div>
                        <div
                          class="o_px-xs"
                          style="padding-left: 8px; padding-right: 8px"
                        ></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-ultra_light o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-light"
                      align="center"
                      style="
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        font-size: 19px;
                        line-height: 28px;
                        background-color: #ebf5fa;
                        color: #82899a;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-top: 64px;
                        padding-bottom: 64px;
                      "
                    >
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="o_bb-primary"
                              height="40"
                              width="32"
                              style="border-bottom: 1px solid #126de5"
                            >
                              &nbsp;
                            </td>
                            <td
                              rowspan="2"
                              class="o_sans o_text o_text-secondary o_px o_py"
                              align="center"
                              style="
                                font-family: Helvetica, Arial, sans-serif;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                font-size: 16px;
                                line-height: 24px;
                                color: #424651;
                                padding-left: 16px;
                                padding-right: 16px;
                                padding-top: 16px;
                                padding-bottom: 16px;
                              "
                            >
                              <img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/check-48-primary.png"
                                width="48"
                                height="48"
                                alt=""
                                style="
                                  max-width: 48px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                "
                              />
                            </td>
                            <td
                              class="o_bb-primary"
                              height="40"
                              width="32"
                              style="border-bottom: 1px solid #126de5"
                            >
                              &nbsp;
                            </td>
                          </tr>
                          <tr>
                            <td height="40">&nbsp;</td>
                            <td height="40">&nbsp;</td>
                          </tr>
                          <tr>
                            <td
                              style="
                                font-size: 8px;
                                line-height: 8px;
                                height: 8px;
                              "
                            >
                              &nbsp;
                            </td>
                            <td
                              style="
                                font-size: 8px;
                                line-height: 8px;
                                height: 8px;
                              "
                            >
                              &nbsp;
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <h2
                        class="o_heading o_text-dark o_mb-xxs"
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-weight: bold;
                          margin-top: 0px;
                          margin-bottom: 4px;
                          color: #242b3d;
                          font-size: 30px;
                          line-height: 39px;
                        "
                      >
                        We are happy to welcome you aboard to Tangoeye.
                      </h2>
                      <br>
                      <p style="margin-top: 0px; margin-bottom: 0px">
                        You are few steps away from viewing your business intelligence dashboard, keep calm and Tangoooo!!!
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white"
                      style="
                        font-size: 24px;
                        line-height: 24px;
                        height: 24px;
                        background-color: #ffffff;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white o_px-md o_py o_sans o_text-xs o_text-light"
                      align="center"
                      style="
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        font-size: 14px;
                        line-height: 21px;
                        background-color: #ffffff;
                        color: #82899a;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-top: 5px;
                        padding-bottom: 0px;
                      "
                    >
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      ></table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white o_px-md o_py-xs"
                      align="center"
                      style="
                        background-color: #ffffff;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-top: 8px;
                        padding-bottom: 8px;
                      "
                    >
                      <table
                        align="center"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        role="presentation"
                      >
                        <tbody>
                          <tr>
                            <td
                              width="300"
                              class="o_btn o_bg-primary o_br o_heading o_text"
                              align="center"
                              style="
                                font-family: Helvetica, Arial, sans-serif;
                                font-weight: bold;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                font-size: 16px;
                                line-height: 24px;
                                mso-padding-alt: 12px 24px;
                                background-color: #126de5;
                                border-radius: 4px;
                              "
                            >
                              <a
                                class="o_text-white"
                                href="${data.uiDomainName}"
                                style="
                                  text-decoration: none;
                                  outline: none;
                                  color: #ffffff;
                                  display: block;
                                  padding: 12px 24px;
                                  mso-text-raise: 3px;
                                "
                                >Redirect to my Dashboard</a
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
  
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white"
                      style="
                        font-size: 48px;
                        line-height: 48px;
                        height: 48px;
                        background-color: #ffffff;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
                padding-bottom: 32px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white o_br-b o_sans"
                      style="
                        font-size: 8px;
                        line-height: 8px;
                        height: 8px;
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        background-color: #ffffff;
                        border-radius: 0px 0px 4px 4px;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="o_re o_px o_pb-lg"
                      align="center"
                      style="
                        font-size: 0;
                        vertical-align: top;
                        padding-left: 16px;
                        padding-right: 16px;
                        background-color: #ffffff;
            
                      "
                    >
                      <div
                        class="o_col o_col-2 o_col-full"
                        style="
                          display: inline-block;
                          vertical-align: top;
                          width: 100%;
                          max-width: 200px;
                        "
                      >
                        <div
                          style="font-size: 24px; line-height: 24px; height: 24px"
                        >
                          &nbsp;
                        </div>
                        <div
                          class="o_px-xs o_sans o_text-xs o_center"
                          style="
                            font-family: Helvetica, Arial, sans-serif;
                            margin-top: -38px;
                            margin-bottom: 12px;
                            font-size: 14px;
                            line-height: 21px;
                            text-align: center;
                            padding-left: 8px;
                            padding-right: 8px;
                          "
                        >
                          <p style="margin-top: 0px; margin-bottom: 0px">
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/facebook-light.png"
                                width="36"
                                height="36"
                                alt="fb"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/twitter-light.png"
                                width="36"
                                height="36"
                                alt="tw"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/instagram-light.png"
                                width="36"
                                height="36"
                                alt="ig"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="o_px-md o_pb-lg o_sans o_text-xs o_text-light"
                      align="center"
                      style="
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        font-size: 14px;
                        line-height: 21px;
                        color: #82899a;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-bottom: 32px;
                        background-color: #ffffff;
                      "
                    >
                      <p
                        class="o_mb-xs"
                        style="margin-top: 0px; margin-bottom: 8px"
                      >
                        ©2021 TangoEye<br />
                        Our Headquarters: 603, Anna Salai, <br />
                        Kannammai Building, First Floor,<br />
                        Chennai-600 006
                      </p>
                      <p style="margin-top: 0px; margin-bottom: 0px">
                        <a
                          class="o_text-xxs o_underline"
                          href="https://tangoeye.ai/"
                          style="
                            text-decoration: underline;
                            outline: none;
                            font-size: 12px;
                            line-height: 19px;
                            color: #a0a3ab;
                          "
                          >https://tangoeye.ai/</a
                        >
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
  
              <div
                class="o_hide-xs"
                style="font-size: 64px; line-height: 64px; height: 64px"
              >
                &nbsp;
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>`;
  return aws.sendEmail(data.email, subject, template);
};

module.exports.sendResetPasswordEmail = (data) => {
  const subject = "Tango Eye | Instructions for changing your Account password";
  const template = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Account Code</title>
      <style type="text/css">
        a { text-decoration: none; outline: none; }
        @media (max-width: 649px) {
          .o_col-full { max-width: 100% !important; }
          .o_col-half { max-width: 50% !important; }
          .o_hide-lg { display: inline-block !important; font-size: inherit !important; max-height: none !important; line-height: inherit !important; overflow: visible !important; width: auto !important; visibility: visible !important; }
          .o_hide-xs, .o_hide-xs.o_col_i { display: none !important; font-size: 0 !important; max-height: 0 !important; width: 0 !important; line-height: 0 !important; overflow: hidden !important; visibility: hidden !important; height: 0 !important; }
          .o_xs-center { text-align: center !important; }
          .o_xs-left { text-align: left !important; }
          .o_xs-right { text-align: left !important; }
          table.o_xs-left { margin-left: 0 !important; margin-right: auto !important; float: none !important; }
          table.o_xs-right { margin-left: auto !important; margin-right: 0 !important; float: none !important; }
          table.o_xs-center { margin-left: auto !important; margin-right: auto !important; float: none !important; }
          h1.o_heading { font-size: 32px !important; line-height: 41px !important; }
          h2.o_heading { font-size: 26px !important; line-height: 37px !important; }
          h3.o_heading { font-size: 20px !important; line-height: 30px !important; }
          .o_xs-py-md { padding-top: 24px !important; padding-bottom: 24px !important; }
          .o_xs-pt-xs { padding-top: 8px !important; }
          .o_xs-pb-xs { padding-bottom: 8px !important; }
        }
        @media screen {
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
          .o_sans, .o_heading { font-family: "Roboto", sans-serif !important; }
          .o_heading, strong, b { font-weight: 700 !important; }
          a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
        }
      </style>
      <!--[if mso]>
      <style>
        table { border-collapse: collapse; }
        .o_col { float: left; }
      </style>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
    </head>
    <body class="o_body o_bg-light" style="width: 100%;margin: 0px;padding: 0px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;background-color: #dbe5ea;">
      <!-- preview-text -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_hide" align="center" style="display: none;font-size: 0;max-height: 0;width: 0;line-height: 0;overflow: hidden;mso-hide: all;visibility: hidden;">Email Summary (Hidden)</td>
          </tr>
        </tbody>
      </table>
      <!-- header-white -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-top: 32px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_re o_bg-dark o_px o_pb-md o_br-t" align="center" style="font-size: 0;vertical-align: top;background-color: #fff;border-radius: 4px 4px 0px 0px;padding-left: 16px;padding-right: 16px;padding-bottom: 24px;">
                      <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="left" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-2" style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px;">
                        <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                        <div class="o_px-xs o_sans o_text o_left o_xs-center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;text-align: left;padding-left: 8px;padding-right: 8px;">
                          <p style="margin-top: 0px;margin-bottom: 0px;"><a class="o_text-white" href="https://example.com/" style="text-decoration: none;outline: none;color: #ffffff;"><img src="https://tangoeye.ai/wp-content/uploads/2021/06/tangoeye-logo.png" width="136" height="36" alt="SimpleApp" style="max-width: 136px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a></p>
                        </div>
                      </div>
                      <!--[if mso]></td><td width="400" align="right" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-4" style="display: inline-block;vertical-align: top;width: 100%;max-width: 400px;">
                        <div style="font-size: 22px; line-height: 22px; height: 22px;">&nbsp; </div>
                        <div class="o_px-xs" style="padding-left: 8px;padding-right: 8px;">
                          <!-- <table class="o_right o_xs-center" cellspacing="0" cellpadding="0" border="0" role="presentation" style="text-align: right;margin-left: auto;margin-right: 0;">
                            <tbody>
                              <tr>
                                <td class="o_btn-b o_heading o_text-xs" align="center" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;mso-padding-alt: 7px 8px;">
                                  <a class="o_text-dark_light" href="https://example.com/" style="text-decoration: none;outline: none;color: #a0a3ab;display: block;padding: 7px 8px;font-weight: bold;"><span style="mso-text-raise: 6px;display: inline;color: #a0a3ab;">Nykaa </span> <img src="images/person-24-dark_light.png" width="24" height="24" alt="" style="max-width: 24px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a>
                                </td>
                              </tr>
                            </tbody>
                          </table> -->
                        </div>
                      </div>
                      <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- hero-primary-icon-outline -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-primary o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-white" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #126de5;color: #ffffff;padding-left: 24px;padding-right: 24px;padding-top: 64px;padding-bottom: 64px;">
                      <table cellspacing="0" cellpadding="0" border="0" role="presentation">
                        <tbody>
                          <!-- <tr>
                            <td class="o_sans o_text o_text-white o_b-white o_px o_py o_br-max" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;color: #ffffff;border: 2px solid #ffffff;border-radius: 96px;padding-left: 16px;padding-right: 16px;padding-top: 16px;padding-bottom: 16px;">
                              <img src="images/vpn_key-48-white.png" width="48" height="48" alt="" style="max-width: 48px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;">
                            </td>
                          </tr> -->
                          <tr>
                            <td style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </td>
                          </tr>
                        </tbody>
                      </table>
                      <h2 class="o_heading o_mb-xxs" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 4px;font-size: 30px;line-height: 39px;">Forget Password Verification</h2>
                      <p style="margin-top: 0px;margin-bottom: 0px;">We received a request to reset your account's password.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- spacer-lg -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white" style="font-size: 48px;line-height: 48px;height: 48px;background-color: #ffffff;">&nbsp; </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- label-lg -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_px-md o_py o_sans o_text-xs o_text-light" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;background-color: #ffffff;color: #82899a;padding-left: 24px;padding-right: 24px;padding-top: 16px;padding-bottom: 16px;">
                      <p class="o_mb" style="margin-top: 0px;margin-bottom: 16px;"><strong>Here is Your One Time Verification Code</strong></p>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tbody>
                          <tr>
                            <td width="384" class="o_bg-ultra_light o_br o_text-md o_sans o_px-xs o_py-md" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #ebf5fa;border-radius: 4px;padding-left: 8px;padding-right: 8px;padding-top: 24px;padding-bottom: 24px;">
                              <p class="o_text-dark" style="color: #242b3d;margin-top: 0px;margin-bottom: 0px;"><strong>${data.otp}</strong></p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- button-success -->
      <!-- <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
             
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_px-md o_py-xs" align="center" style="background-color: #ffffff;padding-left: 24px;padding-right: 24px;padding-top: 8px;padding-bottom: 8px;">
                      <table align="center" cellspacing="0" cellpadding="0" border="0" role="presentation">
                        <tbody>
                          <tr>
                            <td width="300" class="o_btn o_bg-success o_br o_heading o_text" align="center" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;mso-padding-alt: 12px 24px;background-color: #0ec06e;border-radius: 4px;">
                              <a class="o_text-white" href="https://example.com/" style="text-decoration: none;outline: none;color: #ffffff;display: block;padding: 12px 24px;mso-text-raise: 3px;">Access Your Account</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              
            </td>
          </tr>
        </tbody>
      </table> -->
      <!-- spacer -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white" style="font-size: 24px;line-height: 24px;height: 24px;background-color: #ffffff;">&nbsp; </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- alert-dark -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_px-md o_py" align="left" style="background-color: #ffffff;padding-left: 24px;padding-right: 24px;padding-top: 16px;padding-bottom: 16px;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                        <tbody>
                          <tr>
                            <td width="40" class="o_bg-dark o_br-l o_text-md o_text-white o_sans o_py-xs" align="right" style="vertical-align: top;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #242b3d;color: #ffffff;border-radius: 4px 0px 0px 4px;padding-top: 8px;padding-bottom: 8px;">
                              <img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/warning-24-white.png" width="24" height="24" alt="" style="max-width: 24px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;">
                            </td>
                            <td class="o_bg-dark o_br-r o_text-xs o_text-white o_sans o_px o_py-xs" align="left" style="vertical-align: top;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;background-color: #242b3d;color: #ffffff;border-radius: 0px 4px 4px 0px;padding-left: 16px;padding-right: 16px;padding-top: 8px;padding-bottom: 8px;">
                              <p style="margin-top: 0px;margin-bottom: 0px;"><strong>Information.</strong></p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- spacer -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white" style="font-size: 24px;line-height: 24px;height: 24px;background-color: #ffffff;">&nbsp; </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- footer-light-3cols -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-bottom: 32px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_br-b o_sans" style="font-size: 8px;line-height: 8px;height: 8px;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;background-color: #ffffff;border-radius: 0px 0px 4px 4px;">&nbsp; </td>
                  </tr>
                  <tr>
                    <td class="o_re o_px o_pb-lg" align="center" style="font-size: 0;vertical-align: top;padding-left: 16px;padding-right: 16px; background-color: #ffffff; color:">
                      <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="center" valign="top" style="padding:0px 8px;"><![endif]-->
                    
                      <!--[if mso]></td><td width="200" align="center" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-2 o_col-full" style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px; ">
                        <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                        <div class="o_px-xs o_sans o_text-xs o_center" style="font-family: Helvetica, Arial, sans-serif;margin-top: -38px;
                        margin-bottom: 12px;font-size: 14px;line-height: 21px;text-align: center;padding-left: 8px;padding-right: 8px;">
                          <p style="margin-top: 0px;margin-bottom: 0px;">
                            <a class="o_text-light" href="https://example.com/" style="text-decoration: none;outline: none;color: #82899a;"><img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/facebook-light.png" width="36" height="36" alt="fb" style="max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a><span> &nbsp;</span>
                            <a class="o_text-light" href="https://example.com/" style="text-decoration: none;outline: none;color: #82899a;"><img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/twitter-light.png" width="36" height="36" alt="tw" style="max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a><span> &nbsp;</span>
                            <a class="o_text-light" href="https://example.com/" style="text-decoration: none;outline: none;color: #82899a;"><img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/instagram-light.png" width="36" height="36" alt="ig" style="max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a><span> &nbsp;</span>
                            
                          </p>
                        </div>
                      </div>
                      <!--[if mso]></td><td width="200" align="center" valign="top" style="padding:0px 8px;"><![endif]-->
                     
                      <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                  <tr>
                    <td class="o_px-md o_pb-lg o_sans o_text-xs o_text-light" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;color: #82899a;padding-left: 24px;padding-right: 24px;padding-bottom: 32px; background-color: #ffffff;">
                      
                      <p class="o_mb-xs" style="margin-top: 0px;margin-bottom: 8px;">©2021 TangoEye<br>
                        Our Headquarters: 603, Anna Salai, <br>
                        Kannammai Building, First Floor,<br>
                        Chennai-600 006
                      </p>
                      <p style="margin-top: 0px;margin-bottom: 0px;">
                        <a class="o_text-xxs  o_underline" href="https://tangoeye.ai/" style="text-decoration: underline;outline: none;font-size: 12px;line-height: 19px;color: #a0a3ab;">https://tangoeye.ai/</a>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
              <div class="o_hide-xs" style="font-size: 64px; line-height: 64px; height: 64px;">&nbsp; </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
 `;

  return aws.sendEmail(data.email, subject, template);
};

module.exports.sendResetPasswordEmailSuccess = (data) => {
  const subject = "Tango Eye | You've updated a new password";
  const template = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="x-apple-disable-message-reformatting" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Forgot PassWord Verified</title>
      <style type="text/css">
        a {
          text-decoration: none;
          outline: none;
        }
        @media (max-width: 649px) {
          .o_col-full {
            max-width: 100% !important;
          }
          .o_col-half {
            max-width: 50% !important;
          }
          .o_hide-lg {
            display: inline-block !important;
            font-size: inherit !important;
            max-height: none !important;
            line-height: inherit !important;
            overflow: visible !important;
            width: auto !important;
            visibility: visible !important;
          }
          .o_hide-xs,
          .o_hide-xs.o_col_i {
            display: none !important;
            font-size: 0 !important;
            max-height: 0 !important;
            width: 0 !important;
            line-height: 0 !important;
            overflow: hidden !important;
            visibility: hidden !important;
            height: 0 !important;
          }
          .o_xs-center {
            text-align: center !important;
          }
          .o_xs-left {
            text-align: left !important;
          }
          .o_xs-right {
            text-align: left !important;
          }
          table.o_xs-left {
            margin-left: 0 !important;
            margin-right: auto !important;
            float: none !important;
          }
          table.o_xs-right {
            margin-left: auto !important;
            margin-right: 0 !important;
            float: none !important;
          }
          table.o_xs-center {
            margin-left: auto !important;
            margin-right: auto !important;
            float: none !important;
          }
          h1.o_heading {
            font-size: 32px !important;
            line-height: 41px !important;
          }
          h2.o_heading {
            font-size: 26px !important;
            line-height: 37px !important;
          }
          h3.o_heading {
            font-size: 20px !important;
            line-height: 30px !important;
          }
          .o_xs-py-md {
            padding-top: 24px !important;
            padding-bottom: 24px !important;
          }
          .o_xs-pt-xs {
            padding-top: 8px !important;
          }
          .o_xs-pb-xs {
            padding-bottom: 8px !important;
          }
        }
        @media screen {
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2)
                format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
              U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
          }
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2)
                format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
              U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
          }
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
          .o_sans,
          .o_heading {
            font-family: "Roboto", sans-serif !important;
          }
          .o_heading,
          strong,
          b {
            font-weight: 700 !important;
          }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
          }
        }
      </style>
    </head>
    <body
      class="o_body o_bg-light"
      style="
        width: 100%;
        margin: 0px;
        padding: 0px;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #dbe5ea;
      "
    >
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_hide"
              align="center"
              style="
                display: none;
                font-size: 0;
                max-height: 0;
                width: 0;
                line-height: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
              "
            >
              Email Summary (Hidden)
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
                padding-top: 32px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_re o_bg-dark o_px o_pb-md o_br-t"
                      align="center"
                      style="
                        font-size: 0;
                        vertical-align: top;
                        background-color: #fff;
                        border-radius: 4px 4px 0px 0px;
                        padding-left: 16px;
                        padding-right: 16px;
                        padding-bottom: 24px;
                      "
                    >
                      <div
                        class="o_col o_col-2"
                        style="
                          display: inline-block;
                          vertical-align: top;
                          width: 100%;
                          max-width: 200px;
                        "
                      >
                        <div
                          style="font-size: 24px; line-height: 24px; height: 24px"
                        >
                          &nbsp;
                        </div>
                        <div
                          class="o_px-xs o_sans o_text o_left o_xs-center"
                          style="
                            font-family: Helvetica, Arial, sans-serif;
                            margin-top: 0px;
                            margin-bottom: 0px;
                            font-size: 16px;
                            line-height: 24px;
                            text-align: left;
                            padding-left: 8px;
                            padding-right: 8px;
                          "
                        >
                          <p style="margin-top: 0px; margin-bottom: 0px">
                            <a
                              class="o_text-white"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #ffffff;
                              "
                              ><img
                                src="https://tangoeye.ai/wp-content/uploads/2021/06/tangoeye-logo.png"
                                width="136"
                                height="36"
                                alt="SimpleApp"
                                style="
                                  max-width: 136px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                "
                            /></a>
                          </p>
                        </div>
                      </div>
                      <div
                        class="o_col o_col-4"
                        style="
                          display: inline-block;
                          vertical-align: top;
                          width: 100%;
                          max-width: 400px;
                        "
                      >
                        <div
                          style="font-size: 22px; line-height: 22px; height: 22px"
                        >
                          &nbsp;
                        </div>
                        <div
                          class="o_px-xs"
                          style="padding-left: 8px; padding-right: 8px"
                        ></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-primary o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-white"
                      align="center"
                      style="
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        font-size: 19px;
                        line-height: 28px;
                        background-color: #126de5;
                        color: #ffffff;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-top: 64px;
                        padding-bottom: 64px;
                      "
                    >
                      <table
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        role="presentation"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="o_sans o_text o_text-white o_b-white o_px o_py o_br-max"
                              align="center"
                              style="
                                font-family: Helvetica, Arial, sans-serif;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                font-size: 16px;
                                line-height: 24px;
                                color: #ffffff;
                                border: 2px solid #ffffff;
                                border-radius: 96px;
                                padding-left: 16px;
                                padding-right: 16px;
                                padding-top: 16px;
                                padding-bottom: 16px;
                              "
                            >
                              <img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/vpn_key-48-white.png"
                                width="48"
                                height="48"
                                alt=""
                                style="
                                  max-width: 48px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                "
                              />
                            </td>
                          </tr>
                          <tr>
                            <td
                              style="
                                font-size: 24px;
                                line-height: 24px;
                                height: 24px;
                              "
                            >
                              &nbsp;
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <h2
                        class="o_heading o_mb-xxs"
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-weight: bold;
                          margin-top: 0px;
                          margin-bottom: 4px;
                          font-size: 30px;
                          line-height: 39px;
                        "
                      >
                        New Password Verified
                      </h2>
                      <p style="margin-top: 0px; margin-bottom: 0px">
                      Your password reset request has been processed and changed successfully. In case if it was not you who reset the password then contact us immediately.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white"
                      style="
                        font-size: 48px;
                        line-height: 48px;
                        height: 48px;
                        background-color: #ffffff;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white o_px-md o_py o_sans o_text-xs o_text-light"
                      align="center"
                      style="
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        font-size: 14px;
                        line-height: 21px;
                        background-color: #ffffff;
                        color: #82899a;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-top: 16px;
                        padding-bottom: 16px;
                      "
                    >
                    <table
                    align="center"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    role="presentation"
                  >
                    <tbody>
                      <tr>
                        <td
                          width="300"
                          class="o_btn o_bg-primary o_br o_heading o_text"
                          align="center"
                          style="
                            font-family: Helvetica, Arial, sans-serif;
                            font-weight: bold;
                            margin-top: 0px;
                            margin-bottom: 0px;
                            font-size: 16px;
                            line-height: 24px;
                            mso-padding-alt: 12px 24px;
                            background-color: #126de5;
                            border-radius: 4px;
                          "
                        >
                          <a
                            class="o_text-white"
                            href="${data.uiDomainName}"
                            style="
                              text-decoration: none;
                              outline: none;
                              color: #ffffff;
                              display: block;
                              padding: 12px 24px;
                              mso-text-raise: 3px;
                            "
                            >Redirect to my Dashboard</a
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white"
                      style="
                        font-size: 24px;
                        line-height: 24px;
                        height: 24px;
                        background-color: #ffffff;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white o_px-md o_py"
                      align="left"
                      style="
                        background-color: #ffffff;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-top: 16px;
                        padding-bottom: 16px;
                      "
                    >
                      <table
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        role="presentation"
                      >
                        <tbody>
                          <tr>
                            <td
                              width="40"
                              class="o_bg-dark o_br-l o_text-md o_text-white o_sans o_py-xs"
                              align="right"
                              style="
                                vertical-align: top;
                                font-family: Helvetica, Arial, sans-serif;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                font-size: 19px;
                                line-height: 28px;
                                background-color: #242b3d;
                                color: #ffffff;
                                border-radius: 4px 0px 0px 4px;
                                padding-top: 8px;
                                padding-bottom: 8px;
                              "
                            >
                              <img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/warning-24-white.png"
                                width="24"
                                height="24"
                                alt=""
                                style="
                                  max-width: 24px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                "
                              />
                            </td>
                            <td
                              class="o_bg-dark o_br-r o_text-xs o_text-white o_sans o_px o_py-xs"
                              align="left"
                              style="
                                vertical-align: top;
                                font-family: Helvetica, Arial, sans-serif;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                font-size: 14px;
                                line-height: 21px;
                                background-color: #242b3d;
                                color: #ffffff;
                                border-radius: 0px 4px 4px 0px;
                                padding-left: 16px;
                                padding-right: 16px;
                                padding-top: 8px;
                                padding-bottom: 8px;
                              "
                            >
                              <p style="margin-top: 0px; margin-bottom: 0px">
                                <strong>Information.</strong>
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white"
                      style="
                        font-size: 24px;
                        line-height: 24px;
                        height: 24px;
                        background-color: #ffffff;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
                padding-bottom: 32px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white o_br-b o_sans"
                      style="
                        font-size: 8px;
                        line-height: 8px;
                        height: 8px;
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        background-color: #ffffff;
                        border-radius: 0px 0px 4px 4px;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="o_re o_px o_pb-lg"
                      align="center"
                      style="
                        font-size: 0;
                        vertical-align: top;
                        padding-left: 16px;
                        padding-right: 16px;
                        background-color: #ffffff;
                      "
                    >
                      <div
                        class="o_col o_col-2 o_col-full"
                        style="
                          display: inline-block;
                          vertical-align: top;
                          width: 100%;
                          max-width: 200px;
                        "
                      >
                        <div
                          style="font-size: 24px; line-height: 24px; height: 24px"
                        >
                          &nbsp;
                        </div>
                        <div
                          class="o_px-xs o_sans o_text-xs o_center"
                          style="
                            font-family: Helvetica, Arial, sans-serif;
                            margin-top: -38px;
                            margin-bottom: 12px;
                            font-size: 14px;
                            line-height: 21px;
                            text-align: center;
                            padding-left: 8px;
                            padding-right: 8px;
                          "
                        >
                          <p style="margin-top: 0px; margin-bottom: 0px">
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/facebook-light.png"
                                width="36"
                                height="36"
                                alt="fb"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/twitter-light.png"
                                width="36"
                                height="36"
                                alt="tw"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/instagram-light.png"
                                width="36"
                                height="36"
                                alt="ig"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="o_px-md o_pb-lg o_sans o_text-xs o_text-light"
                      align="center"
                      style="
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        font-size: 14px;
                        line-height: 21px;
                        color: #82899a;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-bottom: 32px;
                        background-color: #ffffff;
                      "
                    >
                      <p
                        class="o_mb-xs"
                        style="margin-top: 0px; margin-bottom: 8px"
                      >
                        ©2021 TangoEye<br />
                        Our Headquarters: 603, Anna Salai, <br />
                        Kannammai Building, First Floor,<br />
                        Chennai-600 006
                      </p>
                      <p style="margin-top: 0px; margin-bottom: 0px">
                        <a
                          class="o_text-xxs o_underline"
                          href="https://tangoeye.ai/"
                          style="
                            text-decoration: underline;
                            outline: none;
                            font-size: 12px;
                            line-height: 19px;
                            color: #a0a3ab;
                          "
                          >https://tangoeye.ai/</a
                        >
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                class="o_hide-xs"
                style="font-size: 64px; line-height: 64px; height: 64px"
              >
                &nbsp;
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>`;

  return aws.sendEmail(data.email, subject, template);
};

module.exports.sendNewStoreConfig = (data) => {
  const subject = "Tango Eye |Your new store has been successfully added";
  const template = `<!doctype html>
  <html lang="en">
  
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Download Tango-EdgeApp</title>
    <style type="text/css">
      a {
        text-decoration: none;
        outline: none;
      }
  
      @media (max-width: 649px) {
        .o_col-full {
          max-width: 100% !important;
        }
  
        .o_col-half {
          max-width: 50% !important;
        }
  
        .o_hide-lg {
          display: inline-block !important;
          font-size: inherit !important;
          max-height: none !important;
          line-height: inherit !important;
          overflow: visible !important;
          width: auto !important;
          visibility: visible !important;
        }
  
        .o_hide-xs,
        .o_hide-xs.o_col_i {
          display: none !important;
          font-size: 0 !important;
          max-height: 0 !important;
          width: 0 !important;
          line-height: 0 !important;
          overflow: hidden !important;
          visibility: hidden !important;
          height: 0 !important;
        }
  
        .o_xs-center {
          text-align: center !important;
        }
  
        .o_xs-left {
          text-align: left !important;
        }
  
        .o_xs-right {
          text-align: left !important;
        }
  
        table.o_xs-left {
          margin-left: 0 !important;
          margin-right: auto !important;
          float: none !important;
        }
  
        table.o_xs-right {
          margin-left: auto !important;
          margin-right: 0 !important;
          float: none !important;
        }
  
        table.o_xs-center {
          margin-left: auto !important;
          margin-right: auto !important;
          float: none !important;
        }
  
        h1.o_heading {
          font-size: 32px !important;
          line-height: 41px !important;
        }
  
        h2.o_heading {
          font-size: 26px !important;
          line-height: 37px !important;
        }
  
        h3.o_heading {
          font-size: 20px !important;
          line-height: 30px !important;
        }
  
        .o_xs-py-md {
          padding-top: 24px !important;
          padding-bottom: 24px !important;
        }
  
        .o_xs-pt-xs {
          padding-top: 8px !important;
        }
  
        .o_xs-pb-xs {
          padding-bottom: 8px !important;
        }
      }
  
      @media screen {
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }
  
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
  
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 700;
          src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }
  
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 700;
          src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
  
        .o_sans,
        .o_heading {
          font-family: "Roboto", sans-serif !important;
        }
  
        .o_heading,
        strong,
        b {
          font-weight: 700 !important;
        }
  
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
        }
      }
    </style>
    <!--[if mso]>
        <style>
          table { border-collapse: collapse; }
          .o_col { float: left; }
        </style>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
  </head>
  
  <body class="o_body o_bg-light"
    style="width: 100%;margin: 0px;padding: 0px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;background-color: #dbe5ea;">
    <!-- preview-text -->
    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
      <tbody>
        <tr>
          <td class="o_hide" align="center"
            style="display: none;font-size: 0;max-height: 0;width: 0;line-height: 0;overflow: hidden;mso-hide: all;visibility: hidden;">
            Email Summary (Hidden)</td>
        </tr>
      </tbody>
    </table>
    <!-- header-link -->
    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
      <tbody>
        <tr>
          <td class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs" align="center"
            style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-top: 32px;">
            <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
            <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"
              style="max-width: 632px;margin: 0 auto;">
              <tbody>
                <tr>
                  <td class="o_re o_bg-dark o_px o_pb-md o_br-t" align="center"
                    style="font-size: 0;vertical-align: top;background-color: #fff;border-radius: 4px 4px 0px 0px;padding-left: 16px;padding-right: 16px;padding-bottom: 24px;">
                    <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="left" valign="top" style="padding:0px 8px;"><![endif]-->
                    <div class="o_col o_col-2"
                      style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px;">
                      <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                      <div class="o_px-xs o_sans o_text o_left o_xs-center"
                        style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;text-align: left;padding-left: 8px;padding-right: 8px;">
                        <p style="margin-top: 0px;margin-bottom: 0px;"><a class="o_text-white" href="https://example.com/"
                            style="text-decoration: none;outline: none;color: #ffffff;"><img
                              src="https://tangoeye.ai/wp-content/uploads/2021/06/tangoeye-logo.png" width="136"
                              height="36" alt="SimpleApp"
                              style="max-width: 136px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a>
                        </p>
                      </div>
                    </div>
                    <!--[if mso]></td><td width="400" align="right" valign="top" style="padding:0px 8px;"><![endif]-->
                    <div class="o_col o_col-4"
                      style="display: inline-block;vertical-align: top;width: 100%;max-width: 400px;">
                      <div style="font-size: 22px; line-height: 22px; height: 22px;">&nbsp; </div>
                      <div class="o_px-xs" style="padding-left: 8px;padding-right: 8px;">
                        <!-- <table class="o_right o_xs-center" cellspacing="0" cellpadding="0" border="0" role="presentation" style="text-align: right;margin-left: auto;margin-right: 0;">
                              <tbody>
                                <tr>
                                  <td class="o_btn-b o_heading o_text-xs" align="center" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;mso-padding-alt: 7px 8px;">
                                    <a class="o_text-dark_light" href="https://example.com/" style="text-decoration: none;outline: none;color: #a0a3ab;display: block;padding: 7px 8px;font-weight: bold;"><span style="mso-text-raise: 6px;display: inline;color: #a0a3ab;">Nykaa </span> <img src="images/person-24-dark_light.png" width="24" height="24" alt="" style="max-width: 24px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a>
                                  </td>
                                </tr>
                              </tbody>
                            </table> -->
                      </div>
                    </div>
                    <!--[if mso]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            <!--[if mso]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!-- hero-white-button -->
    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
      <tbody>
        <tr>
          <td class="o_bg-light o_px-xs" align="center"
            style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
            <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
            <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"
              style="max-width: 632px;margin: 0 auto;">
              <tbody>
                <tr>
                  <td class="o_bg-white o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-light" align="center"
                    style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #009EF7;color: #fff;padding-left: 24px;padding-right: 24px;padding-top: 64px;padding-bottom: 64px;">
                    <h2 class="o_heading o_text-dark o_mb-xxs"
                      style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 4px;color: #fff;font-size: 25px;line-height: 39px;">
                      Tango Eye - AI Powered CCTV Video Analytics </h2>
                    <p class="o_mb-md"
                      style="margin-top: 0px;margin-bottom: 24px;font-size: 15px; color: #ffff !important;">The bird’s eye
                      view of your business
                      Download Tango Streamer App. Connect your CCTV Cameras to our AI Analytics engine. Long-in to your
                      Tango dashboard for live analytics and insights about your business.
                      .</p>
                    <h2 class="o_heading o_text-dark o_mb-xxs"
                      style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 4px;color: #242b3d;font-size: 25px;line-height: 39px;">
                      App ID: ${data.appId} </h2>
                    <!-- <table align="center" cellspacing="0" cellpadding="0" border="0" role="presentation">
                      <tbody>
                        <tr>
                          <td width="300" class="o_btn o_bg-primary o_br o_heading o_text" align="center"
                            style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;mso-padding-alt: 12px 24px;background-color: #616161;border-radius: 4px;">
                            <a class="o_text-white"
                              href="https://phoenix-jar.s3.ap-southeast-1.amazonaws.com/TangoEyeStreamerSetup_x32.exe"
                              style="     width: 350px; text-decoration: none;outline: none;color: #ffffff;display: block;padding: 12px 24px;mso-text-raise: 3px;">Download
                              Tango Streamer App - x32bit</a>
  
                          </td>
  
                        </tr>
                      </tbody>
                    </table> -->
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"
                      style="max-width: 632px;margin: 0 auto;">
                      <tbody>
                        <tr>
                          <td class="o_bg-white o_px-md o_py o_sans o_text-xs o_text-light" align="center"
                            style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;padding-left: 24px;padding-right: 24px;padding-top: 16px;padding-bottom: 16px;">
  
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                <td width="300" class="o_btn o_bg-primary o_br o_heading o_text" align="center"
                                  style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;mso-padding-alt: 12px 24px;background-color: #616161;border-radius: 4px;">
                                  <a class="o_text-white"
                                    href="https://phoenix-jar.s3.ap-southeast-1.amazonaws.com/TangoEyeStreamerSetup_x64.exe"
                                    style="     width: 350px; text-decoration: none;outline: none;color: #ffffff;display: block;padding: 12px 24px;mso-text-raise: 3px;">Download
                                    Tango Streamer App</a>
  
                                </td>
  
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
  
  
  
  
                  </td>
                </tr>
  
              </tbody>
            </table>
            <!--[if mso]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!-- image-full -->
    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
      <tbody>
        <tr>
          <td class="o_bg-light o_px-xs" align="center"
            style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
            <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
            <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"
              style="max-width: 632px;margin: 0 auto;">
              <tbody>
                <tr>
                  <td class="o_bg-white o_sans o_text o_text-secondary" align="center"
                    style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;background-color: #ffffff;color: #424651;">
                    <p style="margin-top: 0px;margin-bottom: 0px;">
                      <img class="o_img-full"
                        src="data:image/png;base64,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"
                        width="632" height="352" alt=""
                        style="max-width: 75%; -ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;width: 100%;">
                    </p>
  
                  </td>
                </tr>
              </tbody>
            </table>
            <!--[if mso]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!-- spacer -->
    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
      <tbody>
        <tr>
          <td class="o_bg-light o_px-xs" align="center"
            style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
            <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
            <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"
              style="max-width: 632px;margin: 0 auto;">
              <tbody>
                <tr>
                  <td class="o_bg-white"
                    style="font-size: 24px;line-height: 24px;height: 24px;background-color: #ffffff;">&nbsp; </td>
                </tr>
              </tbody>
            </table>
            <!--[if mso]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!-- content -->
    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
      <tbody>
        <tr>
          <td class="o_bg-light o_px-xs" align="center"
            style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
            <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
            <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"
              style="max-width: 632px;margin: 0 auto;">
              <tbody>
                <tr>
                  <td class="o_bg-white o_px-md o_py o_sans o_text o_text-secondary" align="center"
                    style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;background-color: #ffffff;color: #424651;padding-left: 24px;padding-right: 24px;padding-bottom: 16px;">
                    <p style="margin-top: 0px;margin-bottom: 0px;">You are few steps away from viewing your business
                      intelligence dashboard, keep calm and tangoooo!!!</p>
                  </td>
                </tr>
              </tbody>
            </table>
  
            <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
              <tbody>
                <tr>
                  <td class="o_bg-light o_px-xs" align="center"
                    style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                    <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"
                      style="max-width: 632px;margin: 0 auto;">
                      <tbody>
                        <tr>
                          <td class="o_bg-ultra_light o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-light"
                            align="center"
                            style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #ebf5fa;color: #82899a;padding-left: 24px;padding-right: 24px;padding-top: 14px;">
  
                            <h2 class="o_heading o_text-dark o_mb-xxs"
                              style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 4px;color: #242b3d;font-size: 30px;line-height: 39px;">
                              Deployment Pre-requisites</h2>
                            <!-- <p style="margin-top: 0px;margin-bottom: 0px;margin-right: 67%;">Camera Specifications</p> -->
  
  
                          </td>
  
  
  
                        </tr>
                      </tbody>
                    </table>
  
                    <!-- PRE Requisites 1 start-->
  
                    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                      <tbody>
                        <tr>
                          <td class="o_bg-light o_px-xs" align="center"
                            style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                            <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
                            <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0"
                              role="presentation" style="max-width: 632px;margin: 0 auto;     background-color: #ebf5fa;">
                              <tbody>
                                <tr>
                                  <td class="o_bg-white o_sans o_text-xs o_text-light o_px-md o_pt-xs" align="center"
                                    style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;    background-color: #ebf5fa;color: #82899a;padding-left: 24px;padding-right: 24px;padding-top: 8px;">
                                    <p style="margin-top: 0px;margin-bottom: 0px; color: black;  font-size: 22px;">Camera
                                      Specifications
                                    </p>
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td class="o_bb-light"
                                            style="font-size: 8px;line-height: 8px;height: 8px;border-bottom: 1px solid #d3dce0;">
                                            &nbsp; </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"
                      style="max-width: 632px;margin: 0 auto;">
                      <tbody>
                        <tr>
                          <td class="o_re o_bg-white o_px o_pt" align="center"
                            style="font-size: 0; vertical-align: top;  background-color: #ebf5fa;padding-left: 16px;padding-right: 16px;padding-top: 16px;">
  
                            <div class="o_col o_col-3 o_col-full"
                              style="display: inline-block;vertical-align: top;width: 100%;max-width: 300px;">
                              <div style="font-size: 10px; line-height: 10px; height: 10px;">&nbsp; </div>
                              <div class="o_px-xs o_sans o_text-xs o_text-secondary o_left o_xs-center"
                                style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;color: #424651;text-align: left;padding-left: 8px;padding-right: 8px;">
                                <p class="o_text o_text-dark"
                                  style="font-size: 16px;line-height: 24px;color: #242b3d;margin-top: 0px;margin-bottom: 0px;">
                                  <strong>Camera Resolution</strong>
                                </p>
  
                              </div>
                            </div>
                            <!--[if mso]></td><td width="200" align="right" valign="top" style="padding: 0px 8px;"><![endif]-->
                            <div class="o_col o_col-2 o_col-full"
                              style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px;">
                              <div style="font-size: 10px; line-height: 10px; height: 10px;">&nbsp; </div>
                              <div class="o_px-xs o_sans o_text-xxs o_text-light o_right o_xs-center"
                                style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 12px;line-height: 19px;color: #82899a;text-align: right;padding-left: 8px;padding-right: 8px;">
                                <table class="o_right o_xs-center" cellspacing="0" cellpadding="0" border="0"
                                  role="presentation" style="text-align: right;margin-left: auto;margin-right: 0;">
                                  <tbody>
                                    <tr>
  
                                      <p class="o_mb-xs" style="margin-top: 0px;margin-bottom: 8px; font-size: 16px;">2
                                        MB or Higher</p>
  
                                    </tr>
                                  </tbody>
                                </table>
                                <div style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </div>
  
                              </div>
                            </div>
                            <!--[if mso]></td></tr><tr><td colspan="3" style="padding: 0px 8px;"><![endif]-->
  
                            <div class="o_px-xs" style="padding-left: 8px;padding-right: 8px;">
                              <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                                <tbody>
                                  <tr>
                                    <td class="o_re o_bb-light"
                                      style="font-size: 16px;line-height: 16px;height: 16px;vertical-align: top;border-bottom: 1px solid #d3dce0;">
                                      &nbsp; </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
  
                      </tbody>
                    </table>
  
                    <!-- PRE Requisites 1 end-->
  
                    <!-- PRE Requisites 2 start-->
  
                    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                      <tbody>
                        <tr>
                          <td class="o_bg-light o_px-xs" align="center"
                            style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                            <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
                            <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0"
                              role="presentation" style="max-width: 632px;margin: 0 auto;     background-color: #ebf5fa;">
                              <tbody>
                                <tr>
                                  <td class="o_bg-white o_sans o_text-xs o_text-light o_px-md o_pt-xs" align="center"
                                    style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;    background-color: #ebf5fa;color: #82899a;padding-left: 24px;padding-right: 24px;padding-top: 8px;">
                                    <p style="margin-top: 0px;margin-bottom: 0px; color: black;font-size: 22px;">Internet
                                      Bandwidth
                                      Specifications</p>
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td class="o_bb-light"
                                            style="font-size: 8px;line-height: 8px;height: 8px;border-bottom: 1px solid #d3dce0;">
                                            &nbsp; </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"
                      style="max-width: 632px;margin: 0 auto;">
                      <tbody>
                        <tr>
                          <td class="o_re o_bg-white o_px o_pt" align="center"
                            style="font-size: 0; vertical-align: top;  background-color: #ebf5fa;padding-left: 16px;padding-right: 16px;padding-top: 16px;">
  
                            <div class="o_col o_col-3 o_col-full"
                              style="display: inline-block;vertical-align: top;width: 100%;max-width: 300px;">
                              <div style="font-size: 10px; line-height: 10px; height: 10px;">&nbsp; </div>
                              <div class="o_px-xs o_sans o_text-xs o_text-secondary o_left o_xs-center"
                                style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;color: #424651;text-align: left;padding-left: 8px;padding-right: 8px;">
                                <p class="o_text o_text-dark"
                                  style="font-size: 16px;line-height: 24px;color: #242b3d;margin-top: 0px;margin-bottom: 0px;">
                                  <strong>Upload Speed</strong>
                                </p>
  
                              </div>
                            </div>
                            <!--[if mso]></td><td width="200" align="right" valign="top" style="padding: 0px 8px;"><![endif]-->
                            <div class="o_col o_col-2 o_col-full"
                              style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px;">
                              <div style="font-size: 10px; line-height: 10px; height: 10px;">&nbsp; </div>
                              <div class="o_px-xs o_sans o_text-xxs o_text-light o_right o_xs-center"
                                style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 12px;line-height: 19px;color: #82899a;text-align: right;padding-left: 8px;padding-right: 8px;">
                                <table class="o_right o_xs-center" cellspacing="0" cellpadding="0" border="0"
                                  role="presentation" style="text-align: right;margin-left: auto;margin-right: 0;">
                                  <tbody>
                                    <tr>
  
                                      <p class="o_mb-xs" style="margin-top: 0px;margin-bottom: 8px; font-size: 16px;">2
                                        MBPS</p>
  
                                    </tr>
                                  </tbody>
                                </table>
                                <div style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </div>
  
                              </div>
                            </div>
                            <!--[if mso]></td></tr><tr><td colspan="3" style="padding: 0px 8px;"><![endif]-->
  
  
                            <div class="o_col o_col-3 o_col-full"
                              style="display: inline-block;vertical-align: top;width: 100%;max-width: 300px;">
                              <div style="font-size: 10px; line-height: 10px; height: 10px;">&nbsp; </div>
                              <div class="o_px-xs o_sans o_text-xs o_text-secondary o_left o_xs-center"
                                style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;color: #424651;text-align: left;padding-left: 8px;padding-right: 8px;">
                                <p class="o_text o_text-dark"
                                  style="font-size: 16px;line-height: 24px;color: #242b3d;margin-top: 0px;margin-bottom: 0px;">
                                  <strong>Data</strong>
                                </p>
  
                              </div>
                            </div>
                            <!--[if mso]></td><td width="200" align="right" valign="top" style="padding: 0px 8px;"><![endif]-->
                            <div class="o_col o_col-2 o_col-full"
                              style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px;">
                              <div style="font-size: 10px; line-height: 10px; height: 10px;">&nbsp; </div>
                              <div class="o_px-xs o_sans o_text-xxs o_text-light o_right o_xs-center"
                                style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 12px;line-height: 19px;color: #82899a;text-align: right;padding-left: 8px;padding-right: 8px;">
                                <table class="o_right o_xs-center" cellspacing="0" cellpadding="0" border="0"
                                  role="presentation" style="text-align: right;margin-left: auto;margin-right: 0;">
                                  <p class="o_mb-xs" style="margin-top: 0px;margin-bottom: 8px; margin-left: -58%;
                              margin-right: 0%; font-size: 16px;">100 GB/ Month dedicated to Tango Eye</p>
                                </table>
                                <div style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </div>
  
                              </div>
                            </div>
                            <!--[if mso]></td></tr><tr><td colspan="3" style="padding: 0px 8px;"><![endif]-->
                            <div class="o_px-xs" style="padding-left: 8px;padding-right: 8px;">
                              <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                                <tbody>
                                  <tr>
                                    <td class="o_re o_bb-light"
                                      style="font-size: 16px;line-height: 16px;height: 16px;vertical-align: top;border-bottom: 1px solid #d3dce0;">
                                      &nbsp; </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
  
                      </tbody>
                    </table>
  
  
                    <!-- PRE Requisites 2 end-->
  
  
                    <!-- PRE Requisites 3 start-->
  
                    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                      <tbody>
                        <tr>
                          <td class="o_bg-light o_px-xs" align="center"
                            style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
                            <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
                            <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0"
                              role="presentation" style="max-width: 632px;margin: 0 auto;     background-color: #ebf5fa;">
                              <tbody>
                                <tr>
                                  <td class="o_bg-white o_sans o_text-xs o_text-light o_px-md o_pt-xs" align="center"
                                    style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;    background-color: #ebf5fa;color: #82899a;padding-left: 24px;padding-right: 24px;padding-top: 8px;">
                                    <p style="margin-top: 0px;margin-bottom: 0px; color: black;    font-size: 22px;">Store
                                      System
                                      Specifications</p>
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td class="o_bb-light"
                                            style="font-size: 8px;line-height: 8px;height: 8px;border-bottom: 1px solid #d3dce0;">
                                            &nbsp; </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"
                      style="max-width: 632px;margin: 0 auto;">
                      <tbody>
                        <tr>
                          <td class="o_re o_bg-white o_px o_pt" align="center"
                            style="font-size: 0; vertical-align: top;  background-color: #ebf5fa;padding-left: 16px;padding-right: 16px;padding-top: 16px;">
  
                            <div class="o_col o_col-3 o_col-full"
                              style="display: inline-block;vertical-align: top;width: 100%;max-width: 300px;">
                              <div style="font-size: 10px; line-height: 10px; height: 10px;">&nbsp; </div>
                              <div class="o_px-xs o_sans o_text-xs o_text-secondary o_left o_xs-center"
                                style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;color: #424651;text-align: left;padding-left: 8px;padding-right: 8px;">
                                <p class="o_text o_text-dark"
                                  style="font-size: 16px;line-height: 24px;color: #242b3d;margin-top: 0px;margin-bottom: 0px;">
                                  <strong>Operation System</strong>
                                </p>
  
                              </div>
                            </div>
                            <!--[if mso]></td><td width="200" align="right" valign="top" style="padding: 0px 8px;"><![endif]-->
                            <div class="o_col o_col-2 o_col-full"
                              style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px;">
                              <div style="font-size: 10px; line-height: 10px; height: 10px;">&nbsp; </div>
                              <div class="o_px-xs o_sans o_text-xxs o_text-light o_right o_xs-center"
                                style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 12px;line-height: 19px;color: #82899a;text-align: right;padding-left: 8px;padding-right: 8px;">
                                <table class="o_right o_xs-center" cellspacing="0" cellpadding="0" border="0"
                                  role="presentation" style="text-align: right;margin-left: auto;margin-right: 0;">
                                  <tbody>
                                    <tr>
  
                                      <p class="o_mb-xs" style="margin-top: 0px;margin-bottom: 8px; font-size: 16px;">
                                        Windows 8 and above</p>
  
                                    </tr>
                                  </tbody>
                                </table>
                                <div style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </div>
  
                              </div>
                            </div>
                            <!--[if mso]></td></tr><tr><td colspan="3" style="padding: 0px 8px;"><![endif]-->
  
  
                            <div class="o_col o_col-3 o_col-full"
                              style="display: inline-block;vertical-align: top;width: 100%;max-width: 300px;">
                              <div style="font-size: 10px; line-height: 10px; height: 10px;">&nbsp; </div>
                              <div class="o_px-xs o_sans o_text-xs o_text-secondary o_left o_xs-center"
                                style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;color: #424651;text-align: left;padding-left: 8px;padding-right: 8px;">
                                <p class="o_text o_text-dark"
                                  style="font-size: 16px;line-height: 24px;color: #242b3d;margin-top: 0px;margin-bottom: 0px;">
                                  <strong>CPU</strong>
                                </p>
  
                              </div>
                            </div>
                            <!--[if mso]></td><td width="200" align="right" valign="top" style="padding: 0px 8px;"><![endif]-->
                            <div class="o_col o_col-2 o_col-full"
                              style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px;">
                              <div style="font-size: 10px; line-height: 10px; height: 10px;">&nbsp; </div>
                              <div class="o_px-xs o_sans o_text-xxs o_text-light o_right o_xs-center"
                                style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 12px;line-height: 19px;color: #82899a;text-align: right;padding-left: 8px;padding-right: 8px;">
                                <table class="o_right o_xs-center" cellspacing="0" cellpadding="0" border="0"
                                  role="presentation" style="text-align: right;margin-left: auto;margin-right: 0;">
                                  <p class="o_mb-xs" style="margin-top: 0px;margin-bottom: 8px; font-size: 16px;">Intel
                                    Core i3 and Above</p>
                                </table>
                                <div style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </div>
  
                              </div>
                            </div>
                            <!--[if mso]></td></tr><tr><td colspan="3" style="padding: 0px 8px;"><![endif]-->
                            <div class="o_px-xs" style="padding-left: 8px;padding-right: 8px;">
  
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
  
                      </tbody>
                    </table>
  
  
  
                    <!-- PRE Requisites 3 end-->
  
                  </td>
                </tr>
              </tbody>
            </table>
  
  
          </td>
        </tr>
      </tbody>
    </table>
    <!-- spacer-lg -->
    <!-- <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
      <tbody>
        <tr>
          <td class="o_bg-light o_px-xs" align="center"
            style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
  
            <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"
              style="max-width: 632px;margin: 0 auto;">
              <tbody>
                <tr>
                  <td class="o_bg-white"
                    style="font-size: 48px;line-height: 48px;height: 48px;background-color: #ffffff;">&nbsp; </td>
                </tr>
              </tbody>
            </table>
  
          </td>
        </tr>
      </tbody>
    </table> -->
    <!-- footer-3cols -->
    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
      <tbody>
        <tr>
          <td class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs" align="center"
            style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-bottom: 32px;">
            <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
            <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"
              style="max-width: 632px;margin: 0 auto;">
              <tbody>
  
                <tr>
                  <td class="o_bg-dark o_px-md o_pb-lg o_br-b o_sans o_text-xs o_text-dark_light" align="center"
                    style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;background-color: #616161;color: #fff;border-radius: 0px 0px 4px 4px;padding-left: 24px;padding-right: 24px;padding-bottom: 32px;">
  
                    <p style="margin-top: 20px !important;" class="o_mb-xs" style="margin-top: 0px;margin-bottom: 8px;">
                      ©2021 TangoEye <br>
                      Our Headquarters: 603, Anna Salai, <br>
                      Kannammai Building, First Floor,<br>
                      Chennai-600 006
                    </p>
                    <p style="margin-top: 0px;margin-bottom: 0px;">
                      <a class="o_text-xxs  o_underline" href="https://tangoeye.ai/"
                        style="text-decoration: underline;outline: none;font-size: 12px;line-height: 19px;color: #a0a3ab;">https://tangoeye.ai/</a>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <!--[if mso]></td></tr></table><![endif]-->
            <div class="o_hide-xs" style="font-size: 64px; line-height: 64px; height: 64px;">&nbsp; </div>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
  
  </html>
  `;

  return aws.sendEmail(data.email, subject, template);
};

module.exports.sendNewStoreConfigToAdmin = (data) => {
  const subject = "Retail App | New Store Configured "+data.name;
  const template = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="x-apple-disable-message-reformatting" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>New Client Intimation</title>
      <style type="text/css">
        a {
          text-decoration: none;
          outline: none;
        }
        @media (max-width: 649px) {
          .o_col-full {
            max-width: 100% !important;
          }
          .o_col-half {
            max-width: 50% !important;
          }
          .o_hide-lg {
            display: inline-block !important;
            font-size: inherit !important;
            max-height: none !important;
            line-height: inherit !important;
            overflow: visible !important;
            width: auto !important;
            visibility: visible !important;
          }
          .o_hide-xs,
          .o_hide-xs.o_col_i {
            display: none !important;
            font-size: 0 !important;
            max-height: 0 !important;
            width: 0 !important;
            line-height: 0 !important;
            overflow: hidden !important;
            visibility: hidden !important;
            height: 0 !important;
          }
          .o_xs-center {
            text-align: center !important;
          }
          .o_xs-left {
            text-align: left !important;
          }
          .o_xs-right {
            text-align: left !important;
          }
          table.o_xs-left {
            margin-left: 0 !important;
            margin-right: auto !important;
            float: none !important;
          }
          table.o_xs-right {
            margin-left: auto !important;
            margin-right: 0 !important;
            float: none !important;
          }
          table.o_xs-center {
            margin-left: auto !important;
            margin-right: auto !important;
            float: none !important;
          }
          h1.o_heading {
            font-size: 32px !important;
            line-height: 41px !important;
          }
          h2.o_heading {
            font-size: 26px !important;
            line-height: 37px !important;
          }
          h3.o_heading {
            font-size: 20px !important;
            line-height: 30px !important;
          }
          .o_xs-py-md {
            padding-top: 24px !important;
            padding-bottom: 24px !important;
          }
          .o_xs-pt-xs {
            padding-top: 8px !important;
          }
          .o_xs-pb-xs {
            padding-bottom: 8px !important;
          }
        }
        @media screen {
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2)
                format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
              U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
          }
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2)
                format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
              U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
          }
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"),
              url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
          .o_sans,
          .o_heading {
            font-family: "Roboto", sans-serif !important;
          }
          .o_heading,
          strong,
          b {
            font-weight: 700 !important;
          }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
          }
        }
      </style>
    </head>
    <body
      class="o_body o_bg-light"
      style="
        width: 100%;
        margin: 0px;
        padding: 0px;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #dbe5ea;
      "
    >
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_hide"
              align="center"
              style="
                display: none;
                font-size: 0;
                max-height: 0;
                width: 0;
                line-height: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
              "
            >
              Email Summary (Hidden)
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
                padding-top: 32px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_re o_bg-dark o_px o_pb-md o_br-t"
                      align="center"
                      style="
                        font-size: 0;
                        vertical-align: top;
                        background-color: #fff;
                        border-radius: 4px 4px 0px 0px;
                        padding-left: 16px;
                        padding-right: 16px;
                        padding-bottom: 24px;
                      "
                    >
                      <div
                        class="o_col o_col-2"
                        style="
                          display: inline-block;
                          vertical-align: top;
                          width: 100%;
                          max-width: 200px;
                        "
                      >
                        <div
                          style="font-size: 24px; line-height: 24px; height: 24px"
                        >
                          &nbsp;
                        </div>
                        <div
                          class="o_px-xs o_sans o_text o_left o_xs-center"
                          style="
                            font-family: Helvetica, Arial, sans-serif;
                            margin-top: 0px;
                            margin-bottom: 0px;
                            font-size: 16px;
                            line-height: 24px;
                            text-align: left;
                            padding-left: 8px;
                            padding-right: 8px;
                          "
                        >
                          <p style="margin-top: 0px; margin-bottom: 0px">
                            <a
                              class="o_text-white"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #ffffff;
                              "
                              ><img
                                src="https://tangoeye.ai/wp-content/uploads/2021/06/tangoeye-logo.png"
                                width="136"
                                height="36"
                                alt="SimpleApp"
                                style="
                                  max-width: 136px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                "
                            /></a>
                          </p>
                        </div>
                      </div>
                      <div
                        class="o_col o_col-4"
                        style="
                          display: inline-block;
                          vertical-align: top;
                          width: 100%;
                          max-width: 400px;
                        "
                      >
                        <div
                          style="font-size: 22px; line-height: 22px; height: 22px"
                        >
                          &nbsp;
                        </div>
                        <div
                          class="o_px-xs"
                          style="padding-left: 8px; padding-right: 8px"
                        ></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-ultra_light o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-light"
                      align="center"
                      style="
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        font-size: 19px;
                        line-height: 28px;
                        background-color: #ebf5fa;
                        color: #82899a;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-top: 64px;
                        padding-bottom: 64px;
                      "
                    >
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="o_bb-primary"
                              height="40"
                              width="32"
                              style="border-bottom: 1px solid #126de5"
                            >
                              &nbsp;
                            </td>
                            <td
                              rowspan="2"
                              class="o_sans o_text o_text-secondary o_px o_py"
                              align="center"
                              style="
                                font-family: Helvetica, Arial, sans-serif;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                font-size: 16px;
                                line-height: 24px;
                                color: #424651;
                                padding-left: 16px;
                                padding-right: 16px;
                                padding-top: 16px;
                                padding-bottom: 16px;
                              "
                            >
                              <img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/check-48-primary.png"
                                width="48"
                                height="48"
                                alt=""
                                style="
                                  max-width: 48px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                "
                              />
                            </td>
                            <td
                              class="o_bb-primary"
                              height="40"
                              width="32"
                              style="border-bottom: 1px solid #126de5"
                            >
                              &nbsp;
                            </td>
                          </tr>
                          <tr>
                            <td height="40">&nbsp;</td>
                            <td height="40">&nbsp;</td>
                          </tr>
                          <tr>
                            <td
                              style="
                                font-size: 8px;
                                line-height: 8px;
                                height: 8px;
                              "
                            >
                              &nbsp;
                            </td>
                            <td
                              style="
                                font-size: 8px;
                                line-height: 8px;
                                height: 8px;
                              "
                            >
                              &nbsp;
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <h2
                        class="o_heading o_text-dark o_mb-xxs"
                        style="
                          font-family: Helvetica, Arial, sans-serif;
                          font-weight: bold;
                          margin-top: 0px;
                          margin-bottom: 4px;
                          color: #242b3d;
                          font-size: 30px;
                          line-height: 39px;
                        "
                      >
                        Alert! New Store has Just Added.
                      </h2>
                      <br>
                      <p style="margin-top: 0px; margin-bottom: 0px">
                        Store Name : ${data.name},
                        <br>
                        Phone Number : ${data.phone}
                        <br>
                        Store Email : ${data.email}
                      
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white"
                      style="
                        font-size: 24px;
                        line-height: 24px;
                        height: 24px;
                        background-color: #ffffff;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white o_px-md o_py o_sans o_text-xs o_text-light"
                      align="center"
                      style="
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        font-size: 14px;
                        line-height: 21px;
                        background-color: #ffffff;
                        color: #82899a;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-top: 5px;
                        padding-bottom: 0px;
                      "
                    >
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      ></table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white o_px-md o_py-xs"
                      align="center"
                      style="
                        background-color: #ffffff;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-top: 8px;
                        padding-bottom: 8px;
                      "
                    >
                      <table
                        align="center"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        role="presentation"
                      >
                        <tbody>
                          <tr>
                            <td
                              width="300"
                              class="o_btn o_bg-primary o_br o_heading o_text"
                              align="center"
                              style="
                                font-family: Helvetica, Arial, sans-serif;
                                font-weight: bold;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                font-size: 16px;
                                line-height: 24px;
                                mso-padding-alt: 12px 24px;
                                background-color: #126de5;
                                border-radius: 4px;
                              "
                            >
                              <a
                                class="o_text-white"
                                href="${data.uiDomainName}"
                                style="
                                  text-decoration: none;
                                  outline: none;
                                  color: #ffffff;
                                  display: block;
                                  padding: 12px 24px;
                                  mso-text-raise: 3px;
                                "
                                >Redirect to my Dashboard</a
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
  
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white"
                      style="
                        font-size: 48px;
                        line-height: 48px;
                        height: 48px;
                        background-color: #ffffff;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs"
              align="center"
              style="
                background-color: #dbe5ea;
                padding-left: 8px;
                padding-right: 8px;
                padding-bottom: 32px;
              "
            >
              <table
                class="o_block"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                role="presentation"
                style="max-width: 632px; margin: 0 auto"
              >
                <tbody>
                  <tr>
                    <td
                      class="o_bg-white o_br-b o_sans"
                      style="
                        font-size: 8px;
                        line-height: 8px;
                        height: 8px;
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        background-color: #ffffff;
                        border-radius: 0px 0px 4px 4px;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="o_re o_px o_pb-lg"
                      align="center"
                      style="
                        font-size: 0;
                        vertical-align: top;
                        padding-left: 16px;
                        padding-right: 16px;
                        background-color: #ffffff;
            
                      "
                    >
                      <div
                        class="o_col o_col-2 o_col-full"
                        style="
                          display: inline-block;
                          vertical-align: top;
                          width: 100%;
                          max-width: 200px;
                        "
                      >
                        <div
                          style="font-size: 24px; line-height: 24px; height: 24px"
                        >
                          &nbsp;
                        </div>
                        <div
                          class="o_px-xs o_sans o_text-xs o_center"
                          style="
                            font-family: Helvetica, Arial, sans-serif;
                            margin-top: -38px;
                            margin-bottom: 12px;
                            font-size: 14px;
                            line-height: 21px;
                            text-align: center;
                            padding-left: 8px;
                            padding-right: 8px;
                          "
                        >
                          <p style="margin-top: 0px; margin-bottom: 0px">
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/facebook-light.png"
                                width="36"
                                height="36"
                                alt="fb"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/twitter-light.png"
                                width="36"
                                height="36"
                                alt="tw"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/instagram-light.png"
                                width="36"
                                height="36"
                                alt="ig"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="o_px-md o_pb-lg o_sans o_text-xs o_text-light"
                      align="center"
                      style="
                        font-family: Helvetica, Arial, sans-serif;
                        margin-top: 0px;
                        margin-bottom: 0px;
                        font-size: 14px;
                        line-height: 21px;
                        color: #82899a;
                        padding-left: 24px;
                        padding-right: 24px;
                        padding-bottom: 32px;
                        background-color: #ffffff;
                      "
                    >
                      <p
                        class="o_mb-xs"
                        style="margin-top: 0px; margin-bottom: 8px"
                      >
                        ©2021 TangoEye<br />
                        Our Headquarters: 603, Anna Salai, <br />
                        Kannammai Building, First Floor,<br />
                        Chennai-600 006
                      </p>
                      <p style="margin-top: 0px; margin-bottom: 0px">
                        <a
                          class="o_text-xxs o_underline"
                          href="https://tangoeye.ai/"
                          style="
                            text-decoration: underline;
                            outline: none;
                            font-size: 12px;
                            line-height: 19px;
                            color: #a0a3ab;
                          "
                          >https://tangoeye.ai/</a
                        >
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
  
              <div
                class="o_hide-xs"
                style="font-size: 64px; line-height: 64px; height: 64px"
              >
                &nbsp;
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>`;

  return aws.sendEmail('testtangoeye007@gmail.com', subject, template);
};

module.exports.sendActivetoClient = (data) => {
  const subject = "Retail App | Store Activated";
  const template = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Account Deleted</title>
      <style type="text/css">
        a { text-decoration: none; outline: none; }
        @media (max-width: 649px) {
          .o_col-full { max-width: 100% !important; }
          .o_col-half { max-width: 50% !important; }
          .o_hide-lg { display: inline-block !important; font-size: inherit !important; max-height: none !important; line-height: inherit !important; overflow: visible !important; width: auto !important; visibility: visible !important; }
          .o_hide-xs, .o_hide-xs.o_col_i { display: none !important; font-size: 0 !important; max-height: 0 !important; width: 0 !important; line-height: 0 !important; overflow: hidden !important; visibility: hidden !important; height: 0 !important; }
          .o_xs-center { text-align: center !important; }
          .o_xs-left { text-align: left !important; }
          .o_xs-right { text-align: left !important; }
          table.o_xs-left { margin-left: 0 !important; margin-right: auto !important; float: none !important; }
          table.o_xs-right { margin-left: auto !important; margin-right: 0 !important; float: none !important; }
          table.o_xs-center { margin-left: auto !important; margin-right: auto !important; float: none !important; }
          h1.o_heading { font-size: 32px !important; line-height: 41px !important; }
          h2.o_heading { font-size: 26px !important; line-height: 37px !important; }
          h3.o_heading { font-size: 20px !important; line-height: 30px !important; }
          .o_xs-py-md { padding-top: 24px !important; padding-bottom: 24px !important; }
          .o_xs-pt-xs { padding-top: 8px !important; }
          .o_xs-pb-xs { padding-bottom: 8px !important; }
        }
        @media screen {
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
          .o_sans, .o_heading { font-family: "Roboto", sans-serif !important; }
          .o_heading, strong, b { font-weight: 700 !important; }
          a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
        }
      </style>
      <!--[if mso]>
      <style>
        table { border-collapse: collapse; }
        .o_col { float: left; }
      </style>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
    </head>
    <body class="o_body o_bg-light" style="width: 100%;margin: 0px;padding: 0px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;background-color: #dbe5ea;">
      <!-- preview-text -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_hide" align="center" style="display: none;font-size: 0;max-height: 0;width: 0;line-height: 0;overflow: hidden;mso-hide: all;visibility: hidden;">Email Summary (Hidden)</td>
          </tr>
        </tbody>
      </table>
      <!-- header -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-top: 32px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_re o_bg-dark o_px o_pb-md o_br-t" align="center" style="font-size: 0;vertical-align: top;background-color: #fff;border-radius: 4px 4px 0px 0px;padding-left: 16px;padding-right: 16px;padding-bottom: 24px;">
                      <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="left" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-2" style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px;">
                        <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                        <div class="o_px-xs o_sans o_text o_left o_xs-center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;text-align: left;padding-left: 8px;padding-right: 8px;">
                          <p style="margin-top: 0px;margin-bottom: 0px;"><a class="o_text-white" href="https://example.com/" style="text-decoration: none;outline: none;color: #ffffff;"><img src="https://tangoeye.ai/wp-content/uploads/2021/06/tangoeye-logo.png" width="136" height="36" alt="SimpleApp" style="max-width: 136px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a></p>
                        </div>
                      </div>
                      <!--[if mso]></td><td width="400" align="right" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-4" style="display: inline-block;vertical-align: top;width: 100%;max-width: 400px;">
                        <div style="font-size: 22px; line-height: 22px; height: 22px;">&nbsp; </div>
                        <div class="o_px-xs" style="padding-left: 8px;padding-right: 8px;">
                          <!-- <table class="o_right o_xs-center" cellspacing="0" cellpadding="0" border="0" role="presentation" style="text-align: right;margin-left: auto;margin-right: 0;">
                            <tbody>
                              <tr>
                                <td class="o_btn-b o_heading o_text-xs" align="center" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;mso-padding-alt: 7px 8px;">
                                  <a class="o_text-dark_light" href="https://example.com/" style="text-decoration: none;outline: none;color: #a0a3ab;display: block;padding: 7px 8px;font-weight: bold;"><span style="mso-text-raise: 6px;display: inline;color: #a0a3ab;">Nykaa </span> <img src="images/person-24-dark_light.png" width="24" height="24" alt="" style="max-width: 24px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a>
                                </td>
                              </tr>
                            </tbody>
                          </table> -->
                        </div>
                      </div>
                      <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- hero-white-icon-outline -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-light" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #ffffff;color: #82899a;padding-left: 24px;padding-right: 24px;padding-bottom: 64px;">
                      <table cellspacing="0" cellpadding="0" border="0" role="presentation">
                        <tbody>
                          <tr>
                            <td class="o_sans o_text o_text-secondary o_b-primary o_px o_py o_br-max" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;color: #424651;border: 2px solid #126de5;border-radius: 96px;padding-left: 16px;padding-right: 16px;padding-top: 16px;padding-bottom: 16px;">
                              <img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/check-48-primary.png" width="48" height="48" alt="" style="max-width: 48px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;">
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </td>
                          </tr>
                        </tbody>
                      </table>
                      <h2 class="o_heading o_text-dark o_mb-xxs" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 4px;color: #242b3d;font-size: 30px;line-height: 39px;">Your Store (${data.storeName}) has been Activated</h2>
                      <p style="margin-top: 0px;margin-bottom: 0px;"></p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- content -->
      
      <!-- button-dark -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_px-md o_py-xs" align="center" style="background-color: #ffffff;padding-left: 24px;padding-right: 24px;padding-top: 8px;padding-bottom: 8px;">
                      <table align="center" cellspacing="0" cellpadding="0" border="0" role="presentation">
                        <tbody>
                          <tr>
                            <td width="300" class="o_btn o_bg-dark o_br o_heading o_text" align="center" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;mso-padding-alt: 12px 24px;background-color: #009EF7;border-radius: 4px;">
                              <a class="o_text-white" href="https://tangoeye.ai/" style="text-decoration: none;outline: none;color: #ffffff;display: block;padding: 12px 24px;mso-text-raise: 3px;">Contact Support</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- content -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_px-md o_py o_sans o_text o_text-secondary" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;background-color: #ffffff;color: #424651;padding-left: 24px;padding-right: 24px;padding-top: 16px;padding-bottom: 16px;">
                      <p style="margin-top: 0px;margin-bottom: 0px;"></p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- spacer -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white" style="font-size: 24px;line-height: 24px;height: 24px;background-color: #ffffff;">&nbsp; </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- footer-light-2cols -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-bottom: 32px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_br-b o_sans" style="font-size: 8px;line-height: 8px;height: 8px;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;background-color: #ffffff;border-radius: 0px 0px 4px 4px;">&nbsp; </td>
                  </tr>
                  <tr>
                    <td class="o_re o_px o_pb-lg" align="center" style="font-size: 0;vertical-align: top;padding-left: 16px;padding-right: 16px; background-color: #ffffff; color:">
                      <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="center" valign="top" style="padding:0px 8px;"><![endif]-->
                    
                      <!--[if mso]></td><td width="200" align="center" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-2 o_col-full" style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px; ">
                        <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                        <div class="o_px-xs o_sans o_text-xs o_center" style="font-family: Helvetica, Arial, sans-serif;margin-top: -38px;
                        margin-bottom: 12px;font-size: 14px;line-height: 21px;text-align: center;padding-left: 8px;padding-right: 8px;">
                          <p style="margin-top: 0px; margin-bottom: 0px">
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/facebook-light.png"
                                width="36"
                                height="36"
                                alt="fb"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/twitter-light.png"
                                width="36"
                                height="36"
                                alt="tw"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/instagram-light.png"
                                width="36"
                                height="36"
                                alt="ig"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                          </p>
                        </div>
                      </div>
                      <!--[if mso]></td><td width="200" align="center" valign="top" style="padding:0px 8px;"><![endif]-->
                     
                      <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                  <tr>
                    <td class="o_px-md o_pb-lg o_sans o_text-xs o_text-light" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;color: #82899a;padding-left: 24px;padding-right: 24px;padding-bottom: 32px; background-color: #ffffff;">
                      
                      <p class="o_mb-xs" style="margin-top: 0px;margin-bottom: 8px;">©2021 TangoEye<br>
                        Our Headquarters: 603, Anna Salai, <br>
                        Kannammai Building, First Floor,<br>
                        Chennai-600 006
                      </p>
                      <p style="margin-top: 0px;margin-bottom: 0px;">
                        <a class="o_text-xxs  o_underline" href="https://tangoeye.ai/" style="text-decoration: underline;outline: none;font-size: 12px;line-height: 19px;color: #a0a3ab;">https://tangoeye.ai/</a>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
              <div class="o_hide-xs" style="font-size: 64px; line-height: 64px; height: 64px;">&nbsp; </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  `;

  return aws.sendEmail(data.email, subject, template);
}

module.exports.sendDeactivetoClient = (data) => {
  const subject = "Retail App | Store Deactivated";
  const template = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Account Deleted</title>
      <style type="text/css">
        a { text-decoration: none; outline: none; }
        @media (max-width: 649px) {
          .o_col-full { max-width: 100% !important; }
          .o_col-half { max-width: 50% !important; }
          .o_hide-lg { display: inline-block !important; font-size: inherit !important; max-height: none !important; line-height: inherit !important; overflow: visible !important; width: auto !important; visibility: visible !important; }
          .o_hide-xs, .o_hide-xs.o_col_i { display: none !important; font-size: 0 !important; max-height: 0 !important; width: 0 !important; line-height: 0 !important; overflow: hidden !important; visibility: hidden !important; height: 0 !important; }
          .o_xs-center { text-align: center !important; }
          .o_xs-left { text-align: left !important; }
          .o_xs-right { text-align: left !important; }
          table.o_xs-left { margin-left: 0 !important; margin-right: auto !important; float: none !important; }
          table.o_xs-right { margin-left: auto !important; margin-right: 0 !important; float: none !important; }
          table.o_xs-center { margin-left: auto !important; margin-right: auto !important; float: none !important; }
          h1.o_heading { font-size: 32px !important; line-height: 41px !important; }
          h2.o_heading { font-size: 26px !important; line-height: 37px !important; }
          h3.o_heading { font-size: 20px !important; line-height: 30px !important; }
          .o_xs-py-md { padding-top: 24px !important; padding-bottom: 24px !important; }
          .o_xs-pt-xs { padding-top: 8px !important; }
          .o_xs-pb-xs { padding-bottom: 8px !important; }
        }
        @media screen {
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
          .o_sans, .o_heading { font-family: "Roboto", sans-serif !important; }
          .o_heading, strong, b { font-weight: 700 !important; }
          a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
        }
      </style>
      <!--[if mso]>
      <style>
        table { border-collapse: collapse; }
        .o_col { float: left; }
      </style>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
    </head>
    <body class="o_body o_bg-light" style="width: 100%;margin: 0px;padding: 0px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;background-color: #dbe5ea;">
      <!-- preview-text -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_hide" align="center" style="display: none;font-size: 0;max-height: 0;width: 0;line-height: 0;overflow: hidden;mso-hide: all;visibility: hidden;">Email Summary (Hidden)</td>
          </tr>
        </tbody>
      </table>
      <!-- header -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-top: 32px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_re o_bg-dark o_px o_pb-md o_br-t" align="center" style="font-size: 0;vertical-align: top;background-color: #fff;border-radius: 4px 4px 0px 0px;padding-left: 16px;padding-right: 16px;padding-bottom: 24px;">
                      <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="left" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-2" style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px;">
                        <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                        <div class="o_px-xs o_sans o_text o_left o_xs-center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;text-align: left;padding-left: 8px;padding-right: 8px;">
                          <p style="margin-top: 0px;margin-bottom: 0px;"><a class="o_text-white" href="https://example.com/" style="text-decoration: none;outline: none;color: #ffffff;"><img src="https://tangoeye.ai/wp-content/uploads/2021/06/tangoeye-logo.png" width="136" height="36" alt="SimpleApp" style="max-width: 136px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a></p>
                        </div>
                      </div>
                      <!--[if mso]></td><td width="400" align="right" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-4" style="display: inline-block;vertical-align: top;width: 100%;max-width: 400px;">
                        <div style="font-size: 22px; line-height: 22px; height: 22px;">&nbsp; </div>
                        <div class="o_px-xs" style="padding-left: 8px;padding-right: 8px;">
                          <!-- <table class="o_right o_xs-center" cellspacing="0" cellpadding="0" border="0" role="presentation" style="text-align: right;margin-left: auto;margin-right: 0;">
                            <tbody>
                              <tr>
                                <td class="o_btn-b o_heading o_text-xs" align="center" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;mso-padding-alt: 7px 8px;">
                                  <a class="o_text-dark_light" href="https://example.com/" style="text-decoration: none;outline: none;color: #a0a3ab;display: block;padding: 7px 8px;font-weight: bold;"><span style="mso-text-raise: 6px;display: inline;color: #a0a3ab;">Nykaa </span> <img src="images/person-24-dark_light.png" width="24" height="24" alt="" style="max-width: 24px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a>
                                </td>
                              </tr>
                            </tbody>
                          </table> -->
                        </div>
                      </div>
                      <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- hero-white-icon-outline -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-light" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #ffffff;color: #82899a;padding-left: 24px;padding-right: 24px;padding-bottom: 64px;">
                      <table cellspacing="0" cellpadding="0" border="0" role="presentation">
                        <tbody>
                          <tr>
                            <td class="o_sans o_text o_text-secondary o_b-primary o_px o_py o_br-max" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;color: #424651;border: 2px solid #126de5;border-radius: 96px;padding-left: 16px;padding-right: 16px;padding-top: 16px;padding-bottom: 16px;">
                              <img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/cancel-48-primary.png" width="48" height="48" alt="" style="max-width: 48px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;">
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </td>
                          </tr>
                        </tbody>
                      </table>
                      <h2 class="o_heading o_text-dark o_mb-xxs" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 4px;color: #242b3d;font-size: 30px;line-height: 39px;">Your Store (${data.storeName}) has been Deactivated</h2>
                      <p style="margin-top: 0px;margin-bottom: 0px;">Please contact tango for further assistance for activating your store.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- content -->
      
      <!-- button-dark -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_px-md o_py-xs" align="center" style="background-color: #ffffff;padding-left: 24px;padding-right: 24px;padding-top: 8px;padding-bottom: 8px;">
                      <table align="center" cellspacing="0" cellpadding="0" border="0" role="presentation">
                        <tbody>
                          <tr>
                            <td width="300" class="o_btn o_bg-dark o_br o_heading o_text" align="center" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;mso-padding-alt: 12px 24px;background-color: #009EF7;border-radius: 4px;">
                              <a class="o_text-white" href="https://tangoeye.ai/" style="text-decoration: none;outline: none;color: #ffffff;display: block;padding: 12px 24px;mso-text-raise: 3px;">Contact Support</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- content -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_px-md o_py o_sans o_text o_text-secondary" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;background-color: #ffffff;color: #424651;padding-left: 24px;padding-right: 24px;padding-top: 16px;padding-bottom: 16px;">
                      <p style="margin-top: 0px;margin-bottom: 0px;"></p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- spacer -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white" style="font-size: 24px;line-height: 24px;height: 24px;background-color: #ffffff;">&nbsp; </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- footer-light-2cols -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-bottom: 32px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_br-b o_sans" style="font-size: 8px;line-height: 8px;height: 8px;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;background-color: #ffffff;border-radius: 0px 0px 4px 4px;">&nbsp; </td>
                  </tr>
                  <tr>
                    <td class="o_re o_px o_pb-lg" align="center" style="font-size: 0;vertical-align: top;padding-left: 16px;padding-right: 16px; background-color: #ffffff; color:">
                      <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="center" valign="top" style="padding:0px 8px;"><![endif]-->
                    
                      <!--[if mso]></td><td width="200" align="center" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-2 o_col-full" style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px; ">
                        <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                        <div class="o_px-xs o_sans o_text-xs o_center" style="font-family: Helvetica, Arial, sans-serif;margin-top: -38px;
                        margin-bottom: 12px;font-size: 14px;line-height: 21px;text-align: center;padding-left: 8px;padding-right: 8px;">
                          <p style="margin-top: 0px; margin-bottom: 0px">
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/facebook-light.png"
                                width="36"
                                height="36"
                                alt="fb"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/twitter-light.png"
                                width="36"
                                height="36"
                                alt="tw"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                            <a
                              class="o_text-light"
                              href="https://example.com/"
                              style="
                                text-decoration: none;
                                outline: none;
                                color: #82899a;
                              "
                              ><img
                                src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/instagram-light.png"
                                width="36"
                                height="36"
                                alt="ig"
                                style="
                                  max-width: 36px;
                                  -ms-interpolation-mode: bicubic;
                                  vertical-align: middle;
                                  border: 0;
                                  line-height: 100%;
                                  height: auto;
                                  outline: none;
                                  text-decoration: none;
                                " /></a
                            ><span> &nbsp;</span>
                          </p>
                        </div>
                      </div>
                      <!--[if mso]></td><td width="200" align="center" valign="top" style="padding:0px 8px;"><![endif]-->
                     
                      <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                  <tr>
                    <td class="o_px-md o_pb-lg o_sans o_text-xs o_text-light" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;color: #82899a;padding-left: 24px;padding-right: 24px;padding-bottom: 32px; background-color: #ffffff;">
                      
                      <p class="o_mb-xs" style="margin-top: 0px;margin-bottom: 8px;">©2021 TangoEye<br>
                        Our Headquarters: 603, Anna Salai, <br>
                        Kannammai Building, First Floor,<br>
                        Chennai-600 006
                      </p>
                      <p style="margin-top: 0px;margin-bottom: 0px;">
                        <a class="o_text-xxs  o_underline" href="https://tangoeye.ai/" style="text-decoration: underline;outline: none;font-size: 12px;line-height: 19px;color: #a0a3ab;">https://tangoeye.ai/</a>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
              <div class="o_hide-xs" style="font-size: 64px; line-height: 64px; height: 64px;">&nbsp; </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  `;

  return aws.sendEmail(data.email, subject, template);
}

module.exports.sendsetPasswordEmail = (data) => {
  const subject = "Tango Eye | Instructions for changing your Account password";
  const template = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Account Code</title>
      <style type="text/css">
        a { text-decoration: none; outline: none; }
        @media (max-width: 649px) {
          .o_col-full { max-width: 100% !important; }
          .o_col-half { max-width: 50% !important; }
          .o_hide-lg { display: inline-block !important; font-size: inherit !important; max-height: none !important; line-height: inherit !important; overflow: visible !important; width: auto !important; visibility: visible !important; }
          .o_hide-xs, .o_hide-xs.o_col_i { display: none !important; font-size: 0 !important; max-height: 0 !important; width: 0 !important; line-height: 0 !important; overflow: hidden !important; visibility: hidden !important; height: 0 !important; }
          .o_xs-center { text-align: center !important; }
          .o_xs-left { text-align: left !important; }
          .o_xs-right { text-align: left !important; }
          table.o_xs-left { margin-left: 0 !important; margin-right: auto !important; float: none !important; }
          table.o_xs-right { margin-left: auto !important; margin-right: 0 !important; float: none !important; }
          table.o_xs-center { margin-left: auto !important; margin-right: auto !important; float: none !important; }
          h1.o_heading { font-size: 32px !important; line-height: 41px !important; }
          h2.o_heading { font-size: 26px !important; line-height: 37px !important; }
          h3.o_heading { font-size: 20px !important; line-height: 30px !important; }
          .o_xs-py-md { padding-top: 24px !important; padding-bottom: 24px !important; }
          .o_xs-pt-xs { padding-top: 8px !important; }
          .o_xs-pb-xs { padding-bottom: 8px !important; }
        }
        @media screen {
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format("woff2");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
          @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
          .o_sans, .o_heading { font-family: "Roboto", sans-serif !important; }
          .o_heading, strong, b { font-weight: 700 !important; }
          a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
        }
      </style>
      <!--[if mso]>
      <style>
        table { border-collapse: collapse; }
        .o_col { float: left; }
      </style>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
    </head>
    <body class="o_body o_bg-light" style="width: 100%;margin: 0px;padding: 0px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;background-color: #dbe5ea;">
      <!-- preview-text -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_hide" align="center" style="display: none;font-size: 0;max-height: 0;width: 0;line-height: 0;overflow: hidden;mso-hide: all;visibility: hidden;">Email Summary (Hidden)</td>
          </tr>
        </tbody>
      </table>
      <!-- header-white -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-top: 32px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_re o_bg-dark o_px o_pb-md o_br-t" align="center" style="font-size: 0;vertical-align: top;background-color: #fff;border-radius: 4px 4px 0px 0px;padding-left: 16px;padding-right: 16px;padding-bottom: 24px;">
                      <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="left" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-2" style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px;">
                        <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                        <div class="o_px-xs o_sans o_text o_left o_xs-center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;text-align: left;padding-left: 8px;padding-right: 8px;">
                          <p style="margin-top: 0px;margin-bottom: 0px;"><a class="o_text-white" href="https://example.com/" style="text-decoration: none;outline: none;color: #ffffff;"><img src="https://tangoeye.ai/wp-content/uploads/2021/06/tangoeye-logo.png" width="136" height="36" alt="SimpleApp" style="max-width: 136px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a></p>
                        </div>
                      </div>
                      <!--[if mso]></td><td width="400" align="right" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-4" style="display: inline-block;vertical-align: top;width: 100%;max-width: 400px;">
                        <div style="font-size: 22px; line-height: 22px; height: 22px;">&nbsp; </div>
                        <div class="o_px-xs" style="padding-left: 8px;padding-right: 8px;">
                          <!-- <table class="o_right o_xs-center" cellspacing="0" cellpadding="0" border="0" role="presentation" style="text-align: right;margin-left: auto;margin-right: 0;">
                            <tbody>
                              <tr>
                                <td class="o_btn-b o_heading o_text-xs" align="center" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;mso-padding-alt: 7px 8px;">
                                  <a class="o_text-dark_light" href="https://example.com/" style="text-decoration: none;outline: none;color: #a0a3ab;display: block;padding: 7px 8px;font-weight: bold;"><span style="mso-text-raise: 6px;display: inline;color: #a0a3ab;">Nykaa </span> <img src="images/person-24-dark_light.png" width="24" height="24" alt="" style="max-width: 24px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a>
                                </td>
                              </tr>
                            </tbody>
                          </table> -->
                        </div>
                      </div>
                      <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- hero-primary-icon-outline -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-primary o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-white" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #126de5;color: #ffffff;padding-left: 24px;padding-right: 24px;padding-top: 64px;padding-bottom: 64px;">
                      <table cellspacing="0" cellpadding="0" border="0" role="presentation">
                        <tbody>
                          <!-- <tr>
                            <td class="o_sans o_text o_text-white o_b-white o_px o_py o_br-max" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;color: #ffffff;border: 2px solid #ffffff;border-radius: 96px;padding-left: 16px;padding-right: 16px;padding-top: 16px;padding-bottom: 16px;">
                              <img src="images/vpn_key-48-white.png" width="48" height="48" alt="" style="max-width: 48px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;">
                            </td>
                          </tr> -->
                          <tr>
                            <td style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </td>
                          </tr>
                        </tbody>
                      </table>
                      <h2 class="o_heading o_mb-xxs" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 4px;font-size: 30px;line-height: 39px;">Forget Password Verification</h2>
                      <p style="margin-top: 0px;margin-bottom: 0px;">We received a request to reset your account's password.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- spacer-lg -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white" style="font-size: 48px;line-height: 48px;height: 48px;background-color: #ffffff;">&nbsp; </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- label-lg -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_px-md o_py o_sans o_text-xs o_text-light" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;background-color: #ffffff;color: #82899a;padding-left: 24px;padding-right: 24px;padding-top: 16px;padding-bottom: 16px;">
                      <p class="o_mb" style="margin-top: 0px;margin-bottom: 16px;"><strong>Here is Your One Time Verification Code</strong></p>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tbody>
                          <tr>
                            <td width="384" class="o_bg-ultra_light o_br o_text-md o_sans o_px-xs o_py-md" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #ebf5fa;border-radius: 4px;padding-left: 8px;padding-right: 8px;padding-top: 24px;padding-bottom: 24px;">
                              <p class="o_text-dark" style="color: #242b3d;margin-top: 0px;margin-bottom: 0px;"><strong>${data.otp}</strong></p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- button-success -->
      <!-- <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
             
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_px-md o_py-xs" align="center" style="background-color: #ffffff;padding-left: 24px;padding-right: 24px;padding-top: 8px;padding-bottom: 8px;">
                      <table align="center" cellspacing="0" cellpadding="0" border="0" role="presentation">
                        <tbody>
                          <tr>
                            <td width="300" class="o_btn o_bg-success o_br o_heading o_text" align="center" style="font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;mso-padding-alt: 12px 24px;background-color: #0ec06e;border-radius: 4px;">
                              <a class="o_text-white" href="https://example.com/" style="text-decoration: none;outline: none;color: #ffffff;display: block;padding: 12px 24px;mso-text-raise: 3px;">Access Your Account</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              
            </td>
          </tr>
        </tbody>
      </table> -->
      <!-- spacer -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white" style="font-size: 24px;line-height: 24px;height: 24px;background-color: #ffffff;">&nbsp; </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- alert-dark -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_px-md o_py" align="left" style="background-color: #ffffff;padding-left: 24px;padding-right: 24px;padding-top: 16px;padding-bottom: 16px;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                        <tbody>
                          <tr>
                            <td width="40" class="o_bg-dark o_br-l o_text-md o_text-white o_sans o_py-xs" align="right" style="vertical-align: top;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #242b3d;color: #ffffff;border-radius: 4px 0px 0px 4px;padding-top: 8px;padding-bottom: 8px;">
                              <img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/warning-24-white.png" width="24" height="24" alt="" style="max-width: 24px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;">
                            </td>
                            <td class="o_bg-dark o_br-r o_text-xs o_text-white o_sans o_px o_py-xs" align="left" style="vertical-align: top;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;background-color: #242b3d;color: #ffffff;border-radius: 0px 4px 4px 0px;padding-left: 16px;padding-right: 16px;padding-top: 8px;padding-bottom: 8px;">
                              <p style="margin-top: 0px;margin-bottom: 0px;"><strong>Information.</strong></p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- spacer -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white" style="font-size: 24px;line-height: 24px;height: 24px;background-color: #ffffff;">&nbsp; </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- footer-light-3cols -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
        <tbody>
          <tr>
            <td class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs" align="center" style="background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-bottom: 32px;">
              <!--[if mso]><table width="632" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td><![endif]-->
              <table class="o_block" width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="max-width: 632px;margin: 0 auto;">
                <tbody>
                  <tr>
                    <td class="o_bg-white o_br-b o_sans" style="font-size: 8px;line-height: 8px;height: 8px;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;background-color: #ffffff;border-radius: 0px 0px 4px 4px;">&nbsp; </td>
                  </tr>
                  <tr>
                    <td class="o_re o_px o_pb-lg" align="center" style="font-size: 0;vertical-align: top;padding-left: 16px;padding-right: 16px; background-color: #ffffff; color:">
                      <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="center" valign="top" style="padding:0px 8px;"><![endif]-->
                    
                      <!--[if mso]></td><td width="200" align="center" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-2 o_col-full" style="display: inline-block;vertical-align: top;width: 100%;max-width: 200px; ">
                        <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                        <div class="o_px-xs o_sans o_text-xs o_center" style="font-family: Helvetica, Arial, sans-serif;margin-top: -38px;
                        margin-bottom: 12px;font-size: 14px;line-height: 21px;text-align: center;padding-left: 8px;padding-right: 8px;">
                          <p style="margin-top: 0px;margin-bottom: 0px;">
                            <a class="o_text-light" href="https://example.com/" style="text-decoration: none;outline: none;color: #82899a;"><img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/facebook-light.png" width="36" height="36" alt="fb" style="max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a><span> &nbsp;</span>
                            <a class="o_text-light" href="https://example.com/" style="text-decoration: none;outline: none;color: #82899a;"><img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/twitter-light.png" width="36" height="36" alt="tw" style="max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a><span> &nbsp;</span>
                            <a class="o_text-light" href="https://example.com/" style="text-decoration: none;outline: none;color: #82899a;"><img src="https://s3.ap-south-1.amazonaws.com/auth.tangoeye.ai/mail-template/instagram-light.png" width="36" height="36" alt="ig" style="max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a><span> &nbsp;</span>
                            
                          </p>
                        </div>
                      </div>
                      <!--[if mso]></td><td width="200" align="center" valign="top" style="padding:0px 8px;"><![endif]-->
                     
                      <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                  <tr>
                    <td class="o_px-md o_pb-lg o_sans o_text-xs o_text-light" align="center" style="font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;color: #82899a;padding-left: 24px;padding-right: 24px;padding-bottom: 32px; background-color: #ffffff;">
                      
                      <p class="o_mb-xs" style="margin-top: 0px;margin-bottom: 8px;">©2021 TangoEye<br>
                        Our Headquarters: 603, Anna Salai, <br>
                        Kannammai Building, First Floor,<br>
                        Chennai-600 006
                      </p>
                      <p style="margin-top: 0px;margin-bottom: 0px;">
                        <a class="o_text-xxs  o_underline" href="https://tangoeye.ai/" style="text-decoration: underline;outline: none;font-size: 12px;line-height: 19px;color: #a0a3ab;">https://tangoeye.ai/</a>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></td></tr></table><![endif]-->
              <div class="o_hide-xs" style="font-size: 64px; line-height: 64px; height: 64px;">&nbsp; </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
 `;

  return aws.sendEmail(data.email, subject, template);
};

module.exports.sendTicketCreated = (data) => {
  const subject = "Tango Eye - New Ticket Created";
  const template = `Your Ticket ${data.ticketId} has been created`;

  return aws.sendEmail(data.email, subject, template);
};