(function () {
  const supabaseUrl = window.SUPABASE_URL;
  const supabaseKey = window.SUPABASE_KEY;
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // === SHOW/HIDE PASSWORD TOGGLE ===
  document.querySelectorAll('.toggle-password').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const eyeIcon = btn.querySelector('.icon-eye');
      const eyeOffIcon = btn.querySelector('.icon-eye-off');

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      eyeIcon.style.display = isPassword ? 'none' : 'block';
      eyeOffIcon.style.display = isPassword ? 'block' : 'none';
    });
  });

  // === TOGGLE: ipakita yung Create Account form ===
  const showSignupLink = document.getElementById('showSignup');
  const signupForm = document.getElementById('signupForm');

  showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = signupForm.style.display === 'none' ? 'block' : 'none';
  });

  // === LOGIN (existing account) ===
  document.querySelector('.signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const hint = document.getElementById('loginHint');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      hint.textContent = error.message;
    } else {
      hint.textContent = 'Successfully logged in! Redirecting...';
      window.location.href = 'ECOM.HTML';
    }
  });

  // === CREATE ACCOUNT (sign up) ===
  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const hint = document.getElementById('signupHint');

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      hint.textContent = error.message;
    } else {
      hint.textContent = 'Account created! You can now log in above.';
      document.getElementById('signupForm').reset();
    }
  });
})();