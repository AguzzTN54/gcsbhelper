<section>
	<div class="container">
		<h1>What do you want to Track ?</h1>
		<div class="row">
			<div class="item">
				<a href="/arcade">
					<img src="/images/arcade.png" alt="Arcade" />
				</a>
			</div>
			<div class="item">
				<a href="/juaragcp" class="juaragcp"> <span> #JuaraGCP </span> </a>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		width: 100%;
		height: var(--screen-height);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	h1 {
		font-size: xx-large;
		margin-bottom: 2rem;
		text-align: center;
	}

	.row {
		display: flex;
		justify-content: center;
	}

	.item {
		width: 250px;
		max-width: 40%;
		padding: 5%;
		transition: all 0.5s;
	}

	.item:hover {
		transform: scale(1.1);
	}

	.item a {
		width: 100%;
		aspect-ratio: 1/1;
		background-color: transparent;
		border: none;
		display: flex;
		justify-content: center;
		align-items: center;
		text-decoration: none;
	}
	.juaragcp {
		background-color: #fff !important;
		border-radius: 100%;
		font-size: larger;
		font-weight: 600;
		position: relative;
		color: rgb(255, 145, 0);
	}
	.juaragcp::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 100%;
		transform: scale(1.025);
		background-image: var(--color-gradient);
		z-index: -1;
		animation: rotate 2.5s infinite linear;
	}

	a img {
		width: 100%;
		aspect-ratio: 1/1;
		object-fit: cover;
	}

	@keyframes rotate {
		0% {
			transform: scale(1.025) rotate(0deg);
		}
		0% {
			transform: scale(1.025) rotate(360deg);
		}
	}
</style>
