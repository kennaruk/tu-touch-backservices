module.exports = function(api) {
	api.cache(true);
	const presets = [
		[
			"@babel/preset-env",
			{
				targets: {
					node: "current"
				}
			}
		]
	];
	const plugins = ["@babel/plugin-syntax-dynamic-import"];
	const env = {
		test: {
			presets: [
				[
					"env",
					{
						modules: "commonjs"
					}
				]
			]
		}
	};
	return {
		presets,
		plugins,
		env
	};
};
