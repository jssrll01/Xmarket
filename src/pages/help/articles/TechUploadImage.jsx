import React from 'react';

export default function TechUploadImage() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Why can't I upload a product image?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>Sellers may encounter problems uploading product images because of file size, image format, network connectivity, device permissions, storage limitations, or temporary technical issues.</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I check?</h3>
        <div>
          <p>1. Check your internet connection.</p>
          <p>2. Confirm that the image is in a supported format.</p>
          <p>3. Check the maximum file size.</p>
          <p>4. Make sure the image meets XMARKET's image requirements.</p>
          <p>5. Confirm that the image is not corrupted.</p>
          <p>6. Check your device storage.</p>
          <p>7. Allow XMARKET the required photo or file permissions.</p>
          <p>8. Try a different image.</p>
          <p>9. Update the XMARKET app or browser.</p>
          <p>10. Try uploading again.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why might an image be rejected?</h3>
        <div>
          <p>Possible reasons include:</p>
          <p>• Unsupported file format</p>
          <p>• File is too large</p>
          <p>• Image resolution is outside the allowed range</p>
          <p>• File is corrupted</p>
          <p>• Upload limit has been reached</p>
          <p>• Image violates marketplace requirements</p>
          <p>• Temporary upload problem</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the upload stays at 0% or does not finish?</h3>
        <div>
          <p>Try:</p>
          <p>• Checking your internet connection.</p>
          <p>• Using a smaller image.</p>
          <p>• Refreshing the page.</p>
          <p>• Restarting the app.</p>
          <p>• Trying another supported browser or device.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if only one image fails?</h3>
        <div>
          <p>The file itself may be the problem.</p>
          <p>Try opening the image on your device and uploading another copy or a different image.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Use clear, accurate product images.</p>
          <p>• Follow XMARKET's applicable product-image requirements.</p>
          <p>• Do not upload misleading or prohibited content.</p>
          <p>• Keep original image files before making changes.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• How do I add or edit a product?</p>
          <p>• Why is XMARKET not loading?</p>
          <p>• How do I report a technical problem?</p>
          <p>• What information should I provide when reporting an error?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If valid product images continue to fail during upload, contact XMARKET Support with the error message and image specifications.</p>
        </div>
      </div>
    </div>
  );
}
