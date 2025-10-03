<script lang="ts">
  import Icon from "./Icon.svelte";
</script>

<div class="card">
  <div class="cardHeader">
    <button><Icon size="100%" icon="close"></Icon></button>
  </div>
  <div class="cardBody">
    <div class="cardIcon"><Icon size="50%" icon="star"></Icon></div>
    <div class="cardContents">
      <h3 class="cardTitle">Title</h3>
      <div class="cardText">
        Your file is uploading right now. Just give us a second to finish your
        upload.
      </div>
      <div class="cardActions">
        <div>s</div>
        <div>b</div>
      </div>
    </div>
  </div>
</div>

<style>
  .card {
    aspect-ratio: 2.5/1;
    height: 13rem;
    border-radius: var(--borderRadius);
    box-shadow: black 0px 0px 0.5rem 0.05rem;
    background: radial-gradient(
      ellipse at right top,
      var(--info) 0%,
      var(--secondary) 45%,
      var(--secondary) 100%
    );
    opacity: 0.95;
    transition: opacity 0.25s ease-in;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--background);
    fill: var(--primary);
    padding: 0.5rem;
  }
  .card:hover {
    opacity: 1;
  }
  .cardHeader {
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: end;
  }
  button {
    height: 100%;
    aspect-ratio: 1/1;
  }
  .cardBody {
    width: 100%;
    display: flex;
  }
  .cardIcon {
    width: 30%;
    aspect-ratio: 1/1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .cardContents {
    width: 70%;
    display: flex;
    flex-direction: column;
  }
  .cardTitle {
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: var(--letterSpacing);
    color: #fff;
    padding: 0;
  }
  .cardText {
    color: #d9d9d9;
    width: 100%;
  }
  .cardActions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 10%;
  }
</style>
