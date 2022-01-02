<script>
	
</script>

<div class="container">
    <div class="left">
        <slot name="left"></slot>
    </div>
    <div class="divider"></div>
    <div class="center">
        <slot name="center"></slot>
    </div>
    <div class="divider"></div>
    <div class="right">
        <slot name="right"></slot>
    </div>
</div>

<style>
    .container {
       display: flex;
       width: 100%;
       height: 100%;
    }

    .container > * {
        overflow: hidden;
    }

    .left {
        min-width: 10em;
    }

    .right {
        min-width: 10em;
    }

    .center {
        flex-grow: 1;
    }

    .divider {
        width:1px;
        border-left: 1px solid var(--ui-borders);
    }
</style>