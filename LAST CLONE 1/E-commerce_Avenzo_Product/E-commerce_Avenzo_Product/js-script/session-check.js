(function () {
  const supabaseUrl = 'https://gzwlnhgpqtghmlutsgvn.supabase.co';
  const supabaseKey = 'sb_publishable_MD2Bfh-QkiFsPjFXyKt8uQ_qLoNclYK';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  document.addEventListener('DOMContentLoaded', async () => {
    const authLink = document.getElementById('authLink');
    if (!authLink) return;

    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      authLink.textContent = 'Sign Out';
      authLink.href = '#';
      authLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        window.location.reload();
      });
    } else {
      authLink.textContent = 'Sign In';
      authLink.href = 'Login-page.html';
    }
  });
})();