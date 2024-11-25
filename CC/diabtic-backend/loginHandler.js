const { Firestore } = require('@google-cloud/firestore');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inisialisasi Firestore client
const firestore = new Firestore();

const loginHandler = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Lengkapi semua data.",
    });
  }

  try {
    // Cari pengguna berdasarkan username
    const userRef = firestore.collection("users").doc(username);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(400).json({
        success: false,
        message: "Username tidak ditemukan.",
      });
    }

    const user = userDoc.data();
    
    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Password salah.",
      });
    }

    // Generate JWT Access Token
    const accessToken = jwt.sign(
      { username: user.username, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Generate JWT Refresh Token
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Simpan refresh token ke Firestore untuk referensi jika perlu
    await userRef.update({
      refreshToken,
    });

    // Respons sukses dengan token
    return res.status(200).json({
      success: true,
      message: "Selamat datang.",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Error login: ", error);
    return res.status(500).json({
      success: false,
      message: "Gagal login.",
    });
  }
};

module.exports = loginHandler;