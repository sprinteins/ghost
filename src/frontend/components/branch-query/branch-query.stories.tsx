import { action } from '@storybook/addon-actions'
import * as React from 'react'
import { BranchQuery } from '.'

export default {
    title: 'Components | Branch Query',
    component: BranchQuery,
}

export const Default = () => {

    return (
        <BranchQuery onQuery={action('queried')} />
    )
}
