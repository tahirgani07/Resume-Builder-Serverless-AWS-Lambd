import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { PDFDocument, TextAlignment } from 'pdf-lib';
import { S3 } from 'aws-sdk';

const s3 = new S3();

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    try {
        const body = JSON.parse(Buffer.from(event.body, 'base64').toString());

        const template = await s3
            .getObject({
                Bucket: process.env.bucketName,
                Key: body.resumeTemplate,
            })
            .promise();

        const pdfDoc = await PDFDocument.load(template.Body.toString('base64'));

        const form = pdfDoc.getForm();
        form.getTextField('fullName').setAlignment(TextAlignment.Center);
        form.getTextField('fullName').setText(body.fullName);
        form.getTextField('fullName').setFontSize(24);

        form.getTextField('email').setText(body.email);
        form.getTextField('phoneno').setText(body.phoneno);

        form.getTextField('collegeName').setText(body.collegeName);
        form.getTextField('collegeYear').setText(body.collegeYear);
        form.getTextField('collegeCourseName').setText(body.collegeCourseName);
        form.getTextField('collegeCGPA').setText(body.collegeCGPA);

        form.getTextField('projectName1').setText(body.projectName1);
        form.getTextField('projectTech1').setText(body.projectTech1);
        form.getTextField('projectDesc1').setText(body.projectDesc1);
        form.getTextField('projectDesc1').enableMultiline();

        form.getTextField('projectName2').setText(body.projectName2);
        form.getTextField('projectTech2').setText(body.projectTech2);
        form.getTextField('projectDesc2').setText(body.projectDesc2);
        form.getTextField('projectDesc2').enableMultiline();
        
        form.getTextField('skills').setText(body.skills);
        form.getTextField('skills').enableMultiline();

        form.getTextField('email').setFontSize(13);
        form.getTextField('phoneno').setFontSize(13);
        form.getTextField('collegeName').setFontSize(13);
        form.getTextField('collegeYear').setFontSize(13);
        form.getTextField('collegeCourseName').setFontSize(13);
        form.getTextField('collegeCGPA').setFontSize(13);
        form.getTextField('projectName1').setFontSize(13);
        form.getTextField('projectTech1').setFontSize(13);
        form.getTextField('projectDesc1').setFontSize(13);
        form.getTextField('projectName2').setFontSize(13);
        form.getTextField('projectTech2').setFontSize(13);
        form.getTextField('projectDesc2').setFontSize(13);
        form.getTextField('skills').setFontSize(13);

        form.flatten();

        const pdfOut = await pdfDoc.saveAsBase64();

        return {
            statusCode: 200,
            body: pdfOut.toString(),
            isBase64Encoded: true,
            headers: {
                'Content-Type': 'application/pdf',
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message,
            }),
        };
    }
};
