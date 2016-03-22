### Complete list of `at-form-*` elements used in `at-form-designer` and how their values are rendered in `at-rule-edit`


#### at-form-checkbox (handles Checkbox and Toggle)

Possible values:
* true
* false

Current rendering :
* in **at-rule-conditions** as `select` tag with static values of `true` and `false`
* in **at-rule-actions** -> `Update Field Value` action as `select` tag with static values of `true` and `false`

#### at-form-codemirror (handles Code)

Value is `string`

Current rendering :
* in **at-rule-conditions** as single line `input` tag
* in **at-rule-actions** -> `Update Field Value` action as single line `input` tag

#### at-form-date (handles Date, Time and Date and time)

Value is `string`

Current rendering :
* in **at-rule-conditions** as single line `input` tag
* in **at-rule-actions** -> `Update Field Value` action as single line `input` tag

#### at-form-daterange (handles Daterange)

Value is `string`

Current rendering :
* in **at-rule-conditions** as single line `input` tag
* in **at-rule-actions** -> `Update Field Value` action as single line `input` tag

#### at-form-file (handles File)

Value is `object`

Current rendering :
* in **at-rule-conditions** as single line `input` tag
* in **at-rule-actions** -> `Update Field Value` action as single line `input` tag

#### at-form-image (handles Image)

Value is `object`

Current rendering :
* in **at-rule-conditions** as single line `input` tag
* in **at-rule-actions** -> `Update Field Value` action as single line `input` tag

#### at-form-lookup (handles Enum and Lookup)

Possible values defined by one of `xvaluelist` or `enum` properties. `available` property is ignored.

Current rendering :
* in **at-rule-conditions** as `select` tag with values from either `xvaluelist` or `enum`
* in **at-rule-actions** -> `Update Field Value` action as `select` tag with values from either `xvaluelist` or `enum`

#### at-form-markdown (handles Markdown)

Value is `string`

Current rendering :
* in **at-rule-conditions** as single line `input` tag
* in **at-rule-actions** -> `Update Field Value` action as single line `input` tag

#### at-form-number (handles Number)

Value is `string`

Current rendering :
* in **at-rule-conditions** as single line `input` tag
* in **at-rule-actions** -> `Update Field Value` action as single line `input` tag

#### at-form-password (handles Password)

Value is `string`

Current rendering :
* in **at-rule-conditions** as single line `input` tag
* in **at-rule-actions** -> `Update Field Value` action as single line `input` tag

#### at-form-radio (handles Radio)

Possible values defined by `xvaluelist` property.

Current rendering :
* in **at-rule-conditions** as `select` tag with values from `xvaluelist`
* in **at-rule-actions** -> `Update Field Value` action as `select` tag with values from `xvaluelist`

#### at-form-section (handles Section)

Value doesn't exist.

Current rendering :
* in **at-rule-conditions** - `none`, code breaks
* in **at-rule-actions** -> `none`, code breaks

#### at-form-text (handles Text)

Value is `string`

Current rendering :
* in **at-rule-conditions** as single line `input` tag
* in **at-rule-actions** -> `Update Field Value` action as single line `input` tag


#### at-form-textarea (handles Textarea)

Value is `string`

Current rendering :
* in **at-rule-conditions** as single line `input` tag
* in **at-rule-actions** -> `Update Field Value` action as single line `input` tag
