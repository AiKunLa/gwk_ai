import { tool } from '@langchain/core/tools'
import fs from 'node:fs/promises'
import path from 'node:path'

import { spawn } from 'node:child_process'

import { z } from 'zod'
import 'dotenv/config'

