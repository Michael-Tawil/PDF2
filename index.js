const { PDFDocument, rgb } = require('pdf-lib')
const fs = require('fs')

const createPDF2 = async () => {

    const pdfDoc = await PDFDocument.create()

    const page = pdfDoc.addPage([600, 400])
    const { width, height } = page.getSize()

    const formdata = {
        name: "John Smith",
        business: "Acme Corp",
        address: "123 fifth ave",
        email: "example@example.com"
    }

    page.drawText('Name: ' + formdata.name, {
        x: 50,
        y: height - 100,
        size: 14,
        color: rgb(0, 0, 0),
    })

    page.drawText('business: ' + formdata.business, {
        x: 50,
        y: height - 130,
        size: 14,
        color: rgb(0, 0, 0),
    })

    page.drawText('address: ' + formdata.address, {
        x: 50,
        y: height - 160,
        size: 14,
        color: rgb(0, 0, 0),
    })

    page.drawText('email: ' + formdata.email, {
        x: 50,
        y: height - 190,
        size: 14,
        color: rgb(0, 0, 0),
    })

    const form = pdfDoc.getForm()

    const nameField = form.createTextField('pdf2_name')
    nameField.setText(formdata.name)
    nameField.addToPage(page, {
        x: 0,
        y: 0,
        width: 1,
        height: 1
    })
    nameField.enableReadOnly()

    const businessField = form.createTextField('pdf2_business')
    businessField.setText(formdata.business)
    businessField.addToPage(page, {
        x: 1,
        y: 0,
        width: 1,
        height: 1
    })
    businessField.enableReadOnly()

    const addressField = form.createTextField('pdf2_address')
    addressField.setText(formdata.address)
    addressField.addToPage(page, {
        x: 2,
        y: 0,
        width: 1,
        height: 1
    })
    addressField.enableReadOnly()

    const emailField = form.createTextField('pdf2_email')
    emailField.setText(formdata.email)
    emailField.addToPage(page, {
        x: 3,
        y: 0,
        width: 1,
        height: 1
    })
    emailField.enableReadOnly()


    const metadataField = form.createTextField('pdf2_metadata')
    const metadata = JSON.stringify({
        version: 'PDF2-1.0',
        created: new Date().toISOString(),
        schema: 'basic-form',
        fields: ['name', 'business', 'address', 'email']
    })
    metadataField.setText(metadata)
    metadataField.addToPage(page, {
        x: 4,
        y: 0,
        width: 1,
        height: 1
    })
    metadataField.enableReadOnly()

    const pdfbytes = await pdfDoc.save()
    return pdfbytes
}

const extractPDF2 = async (filename) => {
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

const main = async () => {
    try {
        console.log('Creating PDF2 with hidden form fields...')
        const pdfBytes = await createPDF2();
        fs.writeFileSync('output_form_fields.pdf', pdfBytes)
        console.log('PDF2 with form fields created successfully!');

        console.log('\n' + '='.repeat(50));
        const extractedData = await extractPDF2('output_form_fields.pdf');

        if (extractedData) {
            console.log('\n=== Round-trip Success! ===');
            console.log('Successfully extracted all form field data');
            console.log('PDF2 concept with form fields is working!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
main()