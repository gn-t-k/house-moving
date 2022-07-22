---
name: 'component'
root: 'src/features'
output: '*'
ignore: ['src/features']
questions:
  component: 'Please enter component name'
---

# `{{ inputs.component | kebab }}/{{ inputs.component | kebab }}.tsx`

```tsx
import { FC } from "react";

type Props = {
};
export const {{ inputs.component | pascal }}: FC<Props> = (props) => <></>;

```

# `{{ inputs.component | kebab }}/{{ inputs.component | kebab }}.stories.tsx`

```tsx
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { ComponentProps } from "react";
import { {{ inputs.component | pascal }} } from "./{{ inputs.component | kebab }}";

type Meta = ComponentMeta<typeof {{ inputs.component | pascal }}>;
type Props = ComponentProps<typeof {{ inputs.component | pascal }}>;
type Story = ComponentStoryObj<typeof {{ inputs.component | pascal }}>;

const componentMeta: Meta = {
  component: {{ inputs.component | pascal }},
};
export default componentMeta;

const Template: Story = {
  render: (props: Props) => {
    const args: Props = {}

    return <{{ inputs.component | pascal }} {...args} />
  },
};

export const Default: Story = {
  ...Template,
};

```

# `{{ inputs.component | kebab }}/{{ inputs.component | kebab }}.test.tsx`

```tsx
import { composeStories } from "@storybook/testing-react";
import * as stories from "././{{ inputs.component | kebab }}.stories";

describe("{{ inputs.component | pascal }}", () => {
  const Stories = composeStories(stories);
});

```
