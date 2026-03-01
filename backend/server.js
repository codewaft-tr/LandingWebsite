const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// SMTP Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.turkticaret.net',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Routes
app.get('/', (req, res) => {
    res.status(200).send('Backend is running');
});

app.post('/api/contact', async (req, res) => {
    const { name, email, company, service, budget, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    try {
        // 1. Notification email to CodeWaft Team
        const adminMailOptions = {
            from: `"CodeWaft Terminal" <${process.env.SMTP_USER}>`,
            to: process.env.RECEIVER_EMAIL,
            subject: `Yeni İletişim Formu Gönderimi: ${service}`,
            text: `
        Yeni proje isteği alındı!
        
        İsim: ${name}
        E-posta: ${email}
        Şirket: ${company || 'N/A'}
        Hizmet: ${service}
        Bütçe: ${budget || 'N/A'}
        
        Mesaj:
        ${message}
      `,
            html: `
        <div style="font-family: 'JetBrains Mono', 'Courier New', monospace; background-color: #0a0a0a; color: #ffffff; padding: 40px; border: 1px solid #333; line-height: 1.6; max-width: 600px; margin: auto; border-radius: 8px;">
          <div style="display: flex; align-items: center; margin-bottom: 25px;">
            <div style="background: #1a1a1a; padding: 10px 15px; border-radius: 5px; border-left: 3px solid #6366f1;">
              <span style="color: #6366f1; font-weight: bold; font-size: 18px;">{</span><span style="color: #fff; font-weight: bold; font-size: 18px;">CW</span><span style="color: #6366f1; font-weight: bold; font-size: 18px;">.</span><span style="color: #6366f1; font-weight: bold; font-size: 18px;">}</span>
            </div>
          </div>
          
          <h2 style="color: #6366f1; border-bottom: 1px solid #222; padding-bottom: 10px; margin-top: 0;">Yeni Proje Sinyali Tespit Edildi</h2>
          
          <div style="background: #111; padding: 20px; border-radius: 6px; border: 1px solid #222;">
            <p style="margin: 5px 0;"><span style="color: #6366f1;">// Kimlik:</span> <span style="color: #fff;">${name}</span></p>
            <p style="margin: 5px 0;"><span style="color: #6366f1;">// Frekans:</span> <a href="mailto:${email}" style="color: #fff; text-decoration: none;">${email}</a></p>
            <p style="margin: 5px 0;"><span style="color: #6366f1;">// Organizasyon:</span> <span style="color: #fff;">${company || 'N/A'}</span></p>
            <p style="margin: 5px 0;"><span style="color: #6366f1;">// Hizmet Modülü:</span> <span style="color: #6366f1; background: rgba(99, 102, 241, 0.1); padding: 2px 6px; border-radius: 4px;">${service.toUpperCase()}</span></p>
            <p style="margin: 5px 0;"><span style="color: #6366f1;">// Bütçe Aralığı:</span> <span style="color: #10b981;">${budget || 'N/A'}</span></p>
          </div>

          <p style="color: #6366f1; margin-top: 25px; margin-bottom: 10px;">// Görev Yükü (Mesaj):</p>
          <div style="background: #151515; border-left: 3px solid #6366f1; padding: 15px; color: #aaa; border-radius: 0 4px 4px 0; font-style: italic;">
            ${message}
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #222; font-size: 12px; color: #555;">
            <p>Sistem: CodeWaft İletişim Ağ Geçidi v2.0</p>
            <p>Konum: Küresel Dağıtık Merkez</p>
            <div style="display: flex; align-items: center;">
              <span style="height: 8px; width: 8px; background: #10b981; border-radius: 50%; display: inline-block; margin-right: 5px;"></span>
              Tüm sistemler çalışır durumda
            </div>
          </div>
        </div>
      `,
        };

        // 2. Auto-reply to User
        const userMailOptions = {
            from: `"CodeWaft" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'İletim Alındı - CodeWaft',
            text: `Merhaba ${name},\n\nSinyaliniz sistemlerimiz tarafından başarıyla yakalandı. Mühendislik ekibimiz gereksinimlerinizi inceleyecek ve 24 saat içinde size geri dönüş yapacaktır.\n\nBize ulaştığınız için teşekkürler!\n\n-- CodeWaft Ekibi`,
            html: `
        <div style="font-family: 'JetBrains Mono', 'Courier New', monospace; background-color: #0a0a0a; color: #ffffff; padding: 40px; border: 1px solid #333; line-height: 1.6; max-width: 600px; margin: auto; border-radius: 8px;">
          <div style="display: flex; align-items: center; margin-bottom: 25px;">
             <div style="background: #1a1a1a; padding: 10px 15px; border-radius: 5px; border-left: 3px solid #6366f1;">
              <span style="color: #6366f1; font-weight: bold; font-size: 18px;">{</span><span style="color: #fff; font-weight: bold; font-size: 18px;">CW</span><span style="color: #6366f1; font-weight: bold; font-size: 18px;">.</span><span style="color: #6366f1; font-weight: bold; font-size: 18px;">}</span>
            </div>
          </div>

          <h2 style="color: #6366f1; margin-top: 0;">Merhaba ${name},</h2>
          <p style="color: #ccc;">Mesajınız mühendislik terminalimize başarıyla iletildi.</p>
          
          <div style="background: #111; padding: 20px; border-radius: 6px; border: 1px solid #222; margin: 25px 0;">
            <p style="margin: 0; color: #6366f1; font-weight: bold;">[DURUM: SINYAL YAKALANDI]</p>
            <p style="margin: 10px 0 0 0; color: #aaa;">Ekibimiz şu anda gönderinizi analiz ediyor. Bu frekans üzerinden <strong>24 saat</strong> içinde bir yanıt bekleyebilirsiniz.</p>
          </div>

          <p style="color: #eee;">Dijital evriminiz için CodeWaft'ı tercih ettiğiniz için teşekkür ederiz.</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #222; font-size: 13px;">
            <p style="margin: 0; color: #fff; font-weight: bold;">CodeWaft Mühendislik Ekibi</p>
            <p style="margin: 5px 0 0 0;"><a href="https://codewaft.com" style="color: #6366f1; text-decoration: none;">codewaft.com</a></p>
          </div>
        </div>
      `,
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userMailOptions),
        ]);

        res.status(200).json({ success: true, ref: Math.floor(100000 + Math.random() * 900000) });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ error: 'Failed to send signal. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Backend mission control running on port ${port}`);
});
