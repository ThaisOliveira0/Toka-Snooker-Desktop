<template>
  <div class="home-root">
  <div class="home-page">
      <div class="logo-area">
        <!-- <img src="/images/tokaname.png" alt="Toka Snooker Bar Logo" class="logo-icon" /> -->
        <span class="logo-text"></span> 
      </div>
    <section class="hero-section">
      <div class="hero-image-container">
        <!-- <img src="/images/toka.jpg" alt="Interior do Toka Snooker Bar" class="main-bar-photo" /> -->
      </div>

      <div class="welcome-content">
        <div class="welcome-text">
          <h1>Bem-vindo ao Toka Snooker Bar!</h1>
          <p>O ponto de encontro ideal para quem curte boa música, diversão entre amigos e aquele clima descontraído de bar e restaurante. Aqui você encontra mesas de sinuca, drinks variados, porções caprichadas e, claro, muito karaokê para soltar a voz!</p>
        </div>
        <div class="mini-gallery horizontal-scroll">
          <!-- <img src="/images/karaoke.jpg" alt="Karaokê" class="mini-photo" />
          <img src="/images/sinuca.jpg" alt="Sinuca" class="mini-photo" />
          <img src="/images/bar1.jpg" alt="Bar 1" class="mini-photo" /> -->
        </div>
      </div>
    </section>

    <section class="call-to-action">
      <h2>Vem curtir com a gente no Toka Snooker Bar!</h2>
      <p>Ambiente descontraído, sinuca de qualidade, karaokê para soltar a voz e uma seleção de drinks e porções que vão deixar sua noite ainda melhor.</p>
      <p>Reúna os amigos, escolha seu som e aproveite tudo o que a Toka tem a oferecer. A gente tá te esperando no coração de Santo André!</p>
      <p class="address">
        <span class="location-icon">📍</span> Endereço: Rua Coronel Alfredo Flaquer, 386 – Vila Assunção, Santo André – SP, 09020-040
      </p>
    </section>

    <section class="gallery-map-section">
      <div class="gallery-container horizontal-scroll">
        <!-- <img src="/images/placa.jpg" alt="Placa Toka" class="gal-photo" />
        <img src="/images/conheca.jpg" alt="Bar" class="gal-photo" />
        <img src="/images/bar.jpg" alt="Prateleiras do Bar" class="gal-photo" />
        <img src="/images/drink%20toka.jpg" alt="Drink Toka" class="gal-photo" />
        <img src="/images/mojito.jpg" alt="Drink Mojito" class="gal-photo" /> -->
      </div>
      
      <div class="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3473.5451415627413!2d-46.5257772!3d-23.663087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce427d5474f175%3A0xfcd0ced5add3dc8a!2sToka%20Snooker%20Karaok%C3%AA%20Bar!5e1!3m2!1spt-BR!2sbr!4v1759421710928!5m2!1spt-BR!2sbr"          width="100%"
          height="100%"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    </section>

    <footer>
    </footer>
  </div>
  </div>
</template>

<script>
import '@/views/Home/Home.css'; 

export default {
  name: 'Home',
};
</script>

<style scoped>

</style>