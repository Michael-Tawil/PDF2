const { PDFDocument, rgb } = require('pdf-lib')
const fs = require('fs')
const {extractPDF2} = require('./ExtractPDF2.js')

const createPDF2 = async () => {

    const pdfDoc = await PDFDocument.create()

    const page = pdfDoc.addPage([600, 400])
    const { width, height } = page.getSize()

    const formdata = {
        name: "John Smith",
        business: "Acme Corp",
        address: "123 fifth ave",
        email: "example@tawil.com"
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



const main = async () => {
    try {
        console.log('Creating PDF2 with hidden form fields...')
        const pdfBytes = await createPDF2();
        fs.writeFileSync('output_form_fields.pdf', pdfBytes)
        console.log('PDF2 with form fields created successfully!');

    } catch (error) {
        console.error('Error:', error);
    }
}
main()