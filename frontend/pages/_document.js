import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* The core Firebase JS SDK */}
        <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>

        {/* Add the Firebase products that you want to use */}
        <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
        <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>
        {/* Add other products as needed */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}