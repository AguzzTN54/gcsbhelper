<div class="size-20 bg-indigo-900 relative z-1 skew-x-10 skew-y-2 profile-pic">
	<div
		class="rounded-tl-[50%] rounded-br-[50%] size-full rotate-5 -skew-x-10 -skew-y-2 bg-indigo-300 overflow-hidden scale-105"
	>
		<img
			src="https://lh3.googleusercontent.com/a/ACg8ocJeuBMql16UznPV_f-Qy6M3XGRDU3I1VJDch2tgr9ZGyVr5SQ=s320-c"
			alt="Profile"
			class="-rotate-5"
		/>
	</div>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.profile-pic {
		&::after,
		&::before {
			content: '';
			@apply top-0 left-0 -z-10 absolute size-full;
		}

		&::after {
			@apply bg-amber-300 -skew-x-10 -skew-y-10 scale-97;
		}

		&::before {
			@apply bg-gray-100 -skew-4 scale-95;
		}
	}
</style>
