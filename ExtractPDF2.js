const fs = require('fs')
const { PDFDocument, rgb } = require('pdf-lib')

async function extractPDF2(filename){
    const existingPdfbytes = fs.readFileSync(filename)
    const pdfDoc = await PDFDocument.load(existingPdfbytes)
    const form = pdfDoc.getForm()

    console.log('\n=== Extracting PDF2 Form Field Data ===');

    try {
        // Extract individual fields
        const nameField = form.getTextField('pdf2_name');
        const businessField = form.getTextField('pdf2_business');
        const addressField = form.getTextField('pdf2_address');
        const emailField = form.getTextField('pdf2_email');
        const metadataField = form.getTextField('pdf2_metadata');

        const name = nameField.getText();
        const business = businessField.getText();
        const address = addressField.getText();
        const email = emailField.getText();
        const metadataJson = metadataField.getText();

        console.log('Name:', name);
        console.log('Business:', business);
        console.log('Address:', address);
        console.log('Email:', email);

        // Parse metadata
        const metadata = JSON.parse(metadataJson);
        console.log('\n=== PDF2 Metadata ===');
        console.log('Version:', metadata.version);
        console.log('Created:', metadata.created);
        console.log('Schema:', metadata.schema);
        console.log('Available fields:', metadata.fields.join(', '));

        return {
            name,
            business,
            address,
            email,
            metadata
        };

    } catch (error) {
        console.error('Error extracting form field data:', error);
        return null;
    }

}

async function main(){
console.log('\n' + '='.repeat(50));
const extractedData = await extractPDF2('output_form_fields.pdf');

if (extractedData) {
    console.log('\n=== Round-trip Success! ===');
    console.log('Successfully extracted all form field data');
    console.log('PDF2 concept with form fields is working!');
    }
}


main()
//module.exports = {extractPDF2}