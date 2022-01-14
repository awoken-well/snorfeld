<script>
let left	
</script>

<div class="container">
    <div bind:this={left} class="left">
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
        position: relative;
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
        width: 1px;
    }

    .divider:hover {
        border-left: 1px solid var(--ui-borders);
        cursor: col-resize;
    }

</style>