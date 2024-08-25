<script lang="ts">
import Prism from 'prismjs';

export let text: string;
const parsed = Prism.highlight(text, Prism.languages.javascript, 'javascript');
</script>
{@html parsed}
