import { action } from '@storybook/addon-actions'
import * as React from 'react'
import { BranchQueryGroup } from '.'

export default {
    title: 'Components | Branch Query Group',
    component: BranchQueryGroup,
}

export const Default = () => {

    return (
        <BranchQueryGroup onQuery={action('queries')} />
    )
}
