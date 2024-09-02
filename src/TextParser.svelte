<script lang="ts">
import Prism from 'prismjs';

export let text: string;
let parsed = "";
$: parsed = Prism.highlight(text, Prism.languages.javascript, 'javascript');
</script>
{@html parsed}
