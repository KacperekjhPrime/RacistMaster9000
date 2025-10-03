<script lang="ts">
  import NotificationCenter from "$lib/ts/Notifications/NotificationCenter";

  let notifications = NotificationCenter.GetInstance().GetNotifications();
</script>

<div class="notificationCenter">
  {#each $notifications as notification}
    <a href={notification.url}>{notification.content}</a>
  {/each}
</div>

<style>
  .notificationCenter {
    position: fixed;
    width: 40rem;
    height: 10rem;
  }
</style>
