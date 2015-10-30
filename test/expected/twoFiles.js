angular.module("ngConstants", [])

.constant("test1Data", {
	"foo": "bar"
})

.constant("test2Data", [
	{
		"baz": true
	},
	{
		"bax": 42
	}
])

;
