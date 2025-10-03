<script lang="ts">
  import Icon from "./Icon.svelte";
</script>

<div class="card">
  <div class="cardHeader">
    <button><Icon size="100%" icon="close" fill="default"></Icon></button>
  </div>
  <div class="cardBody">
    <h3 class="cardTitle">Title</h3>
    <div class="cardIcon"><Icon size="70%" icon="star" fill="info"></Icon></div>
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

<style>
  .card {
    aspect-ratio: 3/1;
    width: 30rem;
    height: fit-content;
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
    padding-top: 1rem;
    padding-bottom: 1rem;
    width: 100%;
    display: grid;
    grid-template-columns: 20% 80%;
  }
  .cardIcon {
    width: 100%;
    max-height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
    grid-column: 1;
    grid-row: 2;
  }
  .cardTitle {
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: var(--letterSpacing);
    color: #fff;
    padding: 0;
    margin: 0;
    grid-column: 2;
    grid-row: 1;
  }
  .cardText {
    color: #d9d9d9;
    width: 100%;
    grid-column: 2;
    grid-row: 2;
    display: flex;
    align-items: center;
  }
  .cardActions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    grid-column: 2;
    grid-row: 3;
  }
</style>
