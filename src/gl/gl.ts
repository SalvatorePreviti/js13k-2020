import { gl_context } from '../page'

import { newProxyBinder } from '../core/objects'

const _functions = newProxyBinder(gl_context)

/** Selects the active texture unit. */
export const gl_activeTexture = _functions.activeTexture

/** Attaches a WebGLShader to a WebGLProgram. */
export const gl_attachShader = _functions.attachShader

/** Begins an asynchronous query. */
export const gl_beginQuery = _functions.beginQuery

/** Starts a transform feedback operation. */
export const gl_beginTransformFeedback = _functions.beginTransformFeedback

/** Binds a generic vertex index to a named attribute variable. */
export const gl_bindAttribLocation = _functions.bindAttribLocation

/** Binds a WebGLBuffer object to a given target. */
export const gl_bindBuffer = _functions.bindBuffer

/** Binds a given WebGLBuffer to a given binding point (target) at a given index. */
export const gl_bindBufferBase = _functions.bindBufferBase

/** Binds a range of a given WebGLBuffer to a given binding point (target) at a given index. */
export const gl_bindBufferRange = _functions.bindBufferRange

/** Binds a WebGLFrameBuffer object to a given target. */
export const gl_bindFramebuffer = _functions.bindFramebuffer

/** Binds a WebGLRenderBuffer object to a given target. */
export const gl_bindRenderbuffer = _functions.bindRenderbuffer

/** Binds a given WebGLSampler to a texture unit. */
export const gl_bindSampler = _functions.bindSampler

/** Binds a WebGLTexture object to a given target. */
export const gl_bindTexture = _functions.bindTexture

/** Binds a passed WebGLTransformFeedback object to the current GL state. */
export const gl_bindTransformFeedback = _functions.bindTransformFeedback

/** Binds a given WebGLVertexArrayObject to the buffer. */
export const gl_bindVertexArray = _functions.bindVertexArray

/** Sets the source and destination blending factors. */
export const gl_blendColor = _functions.blendColor

/** Sets both the RGB blend equation and alpha blend equation to a single equation. */
export const gl_blendEquation = _functions.blendEquation

/** Sets the RGB blend equation and alpha blend equation separately. */
export const gl_blendEquationSeparate = _functions.blendEquationSeparate

/** Defines which function is used for blending pixel arithmetic. */
export const gl_blendFunc = _functions.blendFunc

/** Defines which function is used for blending pixel arithmetic for RGB and alpha components separately. */
export const gl_blendFuncSeparate = _functions.blendFuncSeparate

/** Transfers a block of pixels from the read framebuffer to the draw framebuffer. */
export const gl_blitFramebuffer = _functions.blitFramebuffer

/** Initializes and creates the buffer object's data store. */
export const gl_bufferData = _functions.bufferData

/** Updates a subset of a buffer object's data store. */
export const gl_bufferSubData = _functions.bufferSubData

/** Returns the status of the framebuffer. */
export const gl_checkFramebufferStatus = _functions.checkFramebufferStatus

/** Clears specified buffers to preset values. */
export const gl_clear = _functions.clear

/** Clears buffers from the currently bound framebuffer. */
export const gl_clearBufferfi = _functions.clearBufferfi

/** Clears buffers from the currently bound framebuffer. */
export const gl_clearBufferfv = _functions.clearBufferfv

/** Clears buffers from the currently bound framebuffer. */
export const gl_clearBufferiv = _functions.clearBufferiv

/** Clears buffers from the currently bound framebuffer. */
export const gl_clearBufferuiv = _functions.clearBufferuiv

/** Specifies the color values used when clearing color buffers. */
export const gl_clearColor = _functions.clearColor

/** Specifies the depth value used when clearing the depth buffer. */
export const gl_clearDepth = _functions.clearDepth

/** Specifies the stencil value used when clearing the stencil buffer. */
export const gl_clearStencil = _functions.clearStencil

/** Blocks and waits for a WebGLSync object to become signaled or a given timeout to be passed. */
export const gl_clientWaitSync = _functions.clientWaitSync

/** Sets which color components to enable or to disable when drawing or rendering to a WebGLFramebuffer. */
export const gl_colorMask = _functions.colorMask

/** Compiles a WebGLShader. */
export const gl_compileShader = _functions.compileShader

/** Specifies a 2D texture image in a compressed format. */
export const gl_compressedTexImage2D = _functions.compressedTexImage2D

/** Specifies a three-dimensional texture image in a compressed format. */
export const gl_compressedTexImage3D = _functions.compressedTexImage3D

/** Specifies a 2D texture sub-image in a compressed format. */
export const gl_compressedTexSubImage2D = _functions.compressedTexSubImage2D

/** Specifies a three-dimensional sub-rectangle for a texture image in a compressed format. */
export const gl_compressedTexSubImage3D = _functions.compressedTexSubImage3D

/** Copies part of the data of a buffer to another buffer. */
export const gl_copyBufferSubData = _functions.copyBufferSubData

/** Copies a 2D texture image. */
export const gl_copyTexImage2D = _functions.copyTexImage2D

/** Copies a 2D texture sub-image. */
export const gl_copyTexSubImage2D = _functions.copyTexSubImage2D

/** Copies pixels from the current WebGLFramebuffer into an existing 3D texture sub-image. */
export const gl_copyTexSubImage3D = _functions.copyTexSubImage3D

/** Creates a WebGLBuffer object. */
export const gl_createBuffer = _functions.createBuffer

/** Creates a WebGLFrameBuffer object. */
export const gl_createFramebuffer = _functions.createFramebuffer

/** Creates a WebGLProgram. */
export const gl_createProgram = _functions.createProgram

/** Creates a new WebGLQuery object. */
export const gl_createQuery = _functions.createQuery

/** Creates a WebGLRenderBuffer object. */
export const gl_createRenderbuffer = _functions.createRenderbuffer

/** Creates a new WebGLSampler object. */
export const gl_createSampler = _functions.createSampler

/** Creates a WebGLShader. */
export const gl_createShader = _functions.createShader

/** Creates a WebGLTexture object. */
export const gl_createTexture = _functions.createTexture

/** Creates and initializes WebGLTransformFeedback objects. */
export const gl_createTransformFeedback = _functions.createTransformFeedback

/** Creates a new WebGLVertexArrayObject. */
export const gl_createVertexArray = _functions.createVertexArray

/** Specifies whether or not front- and/or back-facing polygons can be culled. */
export const gl_cullFace = _functions.cullFace

/** Deletes a WebGLBuffer object. */
export const gl_deleteBuffer = _functions.deleteBuffer

/** Deletes a WebGLFrameBuffer object. */
export const gl_deleteFramebuffer = _functions.deleteFramebuffer

/** Deletes a WebGLProgram. */
export const gl_deleteProgram = _functions.deleteProgram

/** Deletes a given WebGLQuery object. */
export const gl_deleteQuery = _functions.deleteQuery

/** Deletes a WebGLRenderBuffer object. */
export const gl_deleteRenderbuffer = _functions.deleteRenderbuffer

/** Deletes a given WebGLSampler object. */
export const gl_deleteSampler = _functions.deleteSampler

/** Deletes a WebGLShader. */
export const gl_deleteShader = _functions.deleteShader

/** Deletes a given WebGLSync object. */
export const gl_deleteSync = _functions.deleteSync

/** Deletes a WebGLTexture object. */
export const gl_deleteTexture = _functions.deleteTexture

/** Deletes a given WebGLTransformFeedback object. */
export const gl_deleteTransformFeedback = _functions.deleteTransformFeedback

/** Deletes a given WebGLVertexArrayObject. */
export const gl_deleteVertexArray = _functions.deleteVertexArray

/** Specifies a function that compares incoming pixel depth to the current depth buffer value. */
export const gl_depthFunc = _functions.depthFunc

/** Sets whether writing into the depth buffer is enabled or disabled. */
export const gl_depthMask = _functions.depthMask

/** Specifies the depth range mapping from normalized device coordinates to window or viewport coordinates. */
export const gl_depthRange = _functions.depthRange

/** Detaches a WebGLShader. */
export const gl_detachShader = _functions.detachShader

/** Disables specific WebGL capabilities for this context. */
export const gl_disable = _functions.disable

/** Disables a vertex attribute array at a given position. */
export const gl_disableVertexAttribArray = _functions.disableVertexAttribArray

/** Renders primitives from array data. */
export const gl_drawArrays = _functions.drawArrays

/** Renders primitives from array data. In addition, it can execute multiple instances of the range of elements. */
export const gl_drawArraysInstanced = _functions.drawArraysInstanced

/** Specifies a list of color buffers to be drawn into. */
export const gl_drawBuffers = _functions.drawBuffers

/** Renders primitives from element array data. */
export const gl_drawElements = _functions.drawElements

/** Renders primitives from array data. In addition, it can execute multiple instances of a set of elements. */
export const gl_drawElementsInstanced = _functions.drawElementsInstanced

/** Renders primitives from array data in a given range. */
export const gl_drawRangeElements = _functions.drawRangeElements

/** Enables specific WebGL capabilities for this context. */
export const gl_enable = _functions.enable

/** Enables a vertex attribute array at a given position. */
export const gl_enableVertexAttribArray = _functions.enableVertexAttribArray

/** Marks the end of an asynchronous query. */
export const gl_endQuery = _functions.endQuery

/** Ends a transform feedback operation. */
export const gl_endTransformFeedback = _functions.endTransformFeedback

/** Creates a new WebGLSync object and inserts it into the GL command stream. */
export const gl_fenceSync = _functions.fenceSync

/** Blocks execution until all previously called commands are finished. */
export const gl_finish = _functions.finish

/** Empties different buffer commands, causing all commands to be executed as quickly as possible. */
export const gl_flush = _functions.flush

/** Attaches a WebGLRenderingBuffer object to a WebGLFrameBuffer object. */
export const gl_framebufferRenderbuffer = _functions.framebufferRenderbuffer

/** Attaches a textures image to a WebGLFrameBuffer object. */
export const gl_framebufferTexture2D = _functions.framebufferTexture2D

/** Attaches a single layer of a texture to a framebuffer. */
export const gl_framebufferTextureLayer = _functions.framebufferTextureLayer

/** Specifies whether polygons are front- or back-facing by setting a winding orientation. */
export const gl_frontFace = _functions.frontFace

/** Generates a set of mipmaps for a WebGLTexture object. */
export const gl_generateMipmap = _functions.generateMipmap

/** Returns information about an active attribute variable. */
export const gl_getActiveAttrib = _functions.getActiveAttrib

/** Returns information about an active uniform variable. */
export const gl_getActiveUniform = _functions.getActiveUniform

/** Retrieves the name of the active uniform block at a given index within a WebGLProgram. */
export const gl_getActiveUniformBlockName = _functions.getActiveUniformBlockName

/** Retrieves information about an active uniform block within a WebGLProgram. */
export const gl_getActiveUniformBlockParameter = _functions.getActiveUniformBlockParameter

/** Retrieves information about active uniforms within a WebGLProgram. */
export const gl_getActiveUniforms = _functions.getActiveUniforms

/** Returns a list of WebGLShader objects attached to a WebGLProgram. */
export const gl_getAttachedShaders = _functions.getAttachedShaders

/** Returns the location of an attribute variable. */
export const gl_getAttribLocation = _functions.getAttribLocation

/** Returns information about the buffer. */
export const gl_getBufferParameter = _functions.getBufferParameter

/** Reads data from a buffer and writes them to an ArrayBuffer or SharedArrayBuffer. */
export const gl_getBufferSubData = _functions.getBufferSubData

/** Returns a WebGLContextAttributes object that contains the actual context parameters. Might return null, if the context is lost. */
export const gl_getContextAttributes = _functions.getContextAttributes

/** Returns error information. */
export const gl_getError = _functions.getError

/** Returns an extension object. */
export const gl_getExtension = _functions.getExtension

/** Returns the binding of color numbers to user-defined varying out variables. */
export const gl_getFragDataLocation = _functions.getFragDataLocation

/** Returns information about the framebuffer. */
export const gl_getFramebufferAttachmentParameter = _functions.getFramebufferAttachmentParameter

/** Returns the indexed value for the given target. */
export const gl_getIndexedParameter = _functions.getIndexedParameter

/** Returns information about implementation-dependent support for internal formats. */
export const gl_getInternalformatParameter = _functions.getInternalformatParameter

/** Returns a value for the passed parameter name. */
export const gl_getParameter = _functions.getParameter

/** Returns the information log for a WebGLProgram object. */
export const gl_getProgramInfoLog = _functions.getProgramInfoLog

/** Returns information about the program. */
export const gl_getProgramParameter = _functions.getProgramParameter

/** Returns a WebGLQuery object for a given target. */
export const gl_getQuery = _functions.getQuery

/** Returns information about a query. */
export const gl_getQueryParameter = _functions.getQueryParameter

/** Returns information about the renderbuffer. */
export const gl_getRenderbufferParameter = _functions.getRenderbufferParameter

/** Returns sampler parameter information. */
export const gl_getSamplerParameter = _functions.getSamplerParameter

/** Returns the information log for a WebGLShader object. */
export const gl_getShaderInfoLog = _functions.getShaderInfoLog

/** Returns information about the shader. */
export const gl_getShaderParameter = _functions.getShaderParameter

/** Returns a WebGLShaderPrecisionFormat object describing the precision for the numeric format of the shader. */
export const gl_getShaderPrecisionFormat = _functions.getShaderPrecisionFormat

/** Returns the source code of a WebGLShader as a string. */
export const gl_getShaderSource = _functions.getShaderSource

/** Returns an Array of DOMString elements with all the supported WebGL extensions. */
export const gl_getSupportedExtensions = _functions.getSupportedExtensions

/** Returns parameter information of a WebGLSync object. */
export const gl_getSyncParameter = _functions.getSyncParameter

/** Returns information about the texture. */
export const gl_getTexParameter = _functions.getTexParameter

/** Returns information about varying variables from WebGLTransformFeedback buffers. */
export const gl_getTransformFeedbackVarying = _functions.getTransformFeedbackVarying

/** Returns the value of a uniform variable at a given location. */
export const gl_getUniform = _functions.getUniform

/** Retrieves the index of a uniform block within a WebGLProgram. */
export const gl_getUniformBlockIndex = _functions.getUniformBlockIndex

/** Retrieves the indices of a number of uniforms within a WebGLProgram. */
export const gl_getUniformIndices = _functions.getUniformIndices

/** Returns the location of a uniform variable. */
export const gl_getUniformLocation = _functions.getUniformLocation

/** Returns information about a vertex attribute at a given position. */
export const gl_getVertexAttrib = _functions.getVertexAttrib

/** Returns the address of a given vertex attribute. */
export const gl_getVertexAttribOffset = _functions.getVertexAttribOffset

/** Specifies hints for certain behaviors. The interpretation of these hints depend on the implementation. */
export const gl_hint = _functions.hint

/** Invalidates the contents of attachments in a framebuffer. */
export const gl_invalidateFramebuffer = _functions.invalidateFramebuffer

/** Invalidates portions of the contents of attachments in a framebuffer */
export const gl_invalidateSubFramebuffer = _functions.invalidateSubFramebuffer

/** Returns a Boolean indicating if the passed buffer is valid. */
export const gl_isBuffer = _functions.isBuffer

/** Returns true if the context is lost, otherwise returns false. */
export const gl_isContextLost = _functions.isContextLost

/** Tests whether a specific WebGL capability is enabled or not for this context. */
export const gl_isEnabled = _functions.isEnabled

/** Returns a Boolean indicating if the passed WebGLFrameBuffer object is valid. */
export const gl_isFramebuffer = _functions.isFramebuffer

/** Returns a Boolean indicating if the passed WebGLProgram is valid. */
export const gl_isProgram = _functions.isProgram

/** Returns true if a given object is a valid WebGLQuery object. */
export const gl_isQuery = _functions.isQuery

/** Returns a Boolean indicating if the passed WebGLRenderingBuffer is valid. */
export const gl_isRenderbuffer = _functions.isRenderbuffer

/** Returns true if a given object is a valid WebGLSampler object. */
export const gl_isSampler = _functions.isSampler

/** Returns a Boolean indicating if the passed WebGLShader is valid. */
export const gl_isShader = _functions.isShader

/** Returns true if the passed object is a valid WebGLSync object. */
export const gl_isSync = _functions.isSync

/** Returns a Boolean indicating if the passed WebGLTexture is valid. */
export const gl_isTexture = _functions.isTexture

/** Returns true if the passed object is a valid WebGLTransformFeedback object. */
export const gl_isTransformFeedback = _functions.isTransformFeedback

/** Returns true if a given object is a valid WebGLVertexArrayObject. */
export const gl_isVertexArray = _functions.isVertexArray

/** Sets the line width of rasterized lines. */
export const gl_lineWidth = _functions.lineWidth

/** Links the passed WebGLProgram object. */
export const gl_linkProgram = _functions.linkProgram

/** Pauses a transform feedback operation. */
export const gl_pauseTransformFeedback = _functions.pauseTransformFeedback

/** Specifies the pixel storage modes */
export const gl_pixelStorei = _functions.pixelStorei

/** Specifies the scale factors and units to calculate depth values. */
export const gl_polygonOffset = _functions.polygonOffset

/** Selects a color buffer as the source for pixels. */
export const gl_readBuffer = _functions.readBuffer

/** Reads a block of pixels from the WebGLFrameBuffer. */
export const gl_readPixels = _functions.readPixels

/** Creates a renderbuffer data store. */
export const gl_renderbufferStorage = _functions.renderbufferStorage

/** Creates and initializes a renderbuffer object's data store and allows specifying the number of samples to be used. */
export const gl_renderbufferStorageMultisample = _functions.renderbufferStorageMultisample

/** Resumes a transform feedback operation. */
export const gl_resumeTransformFeedback = _functions.resumeTransformFeedback

/** Specifies multi-sample coverage parameters for anti-aliasing effects. */
export const gl_sampleCoverage = _functions.sampleCoverage

export const gl_samplerParameterf = _functions.samplerParameterf

export const gl_samplerParameteri = _functions.samplerParameteri

/** Defines the scissor box. */
export const gl_scissor = _functions.scissor

/** Sets the source code in a WebGLShader. */
export const gl_shaderSource = _functions.shaderSource

/** Sets the both front and back function and reference value for stencil testing. */
export const gl_stencilFunc = _functions.stencilFunc

/** Sets the front and/or back function and reference value for stencil testing. */
export const gl_stencilFuncSeparate = _functions.stencilFuncSeparate

/** Controls enabling and disabling of both the front and back writing of individual bits in the stencil planes. */
export const gl_stencilMask = _functions.stencilMask

/** Controls enabling and disabling of front and/or back writing of individual bits in the stencil planes. */
export const gl_stencilMaskSeparate = _functions.stencilMaskSeparate

/** Sets both the front and back-facing stencil test actions. */
export const gl_stencilOp = _functions.stencilOp

/** Sets the front and/or back-facing stencil test actions. */
export const gl_stencilOpSeparate = _functions.stencilOpSeparate

/** Specifies a 2D texture image. */
export const gl_texImage2D = _functions.texImage2D

/** Specifies a three-dimensional texture image. */
export const gl_texImage3D = _functions.texImage3D

/** Sets texture parameters. */
export const gl_texParameterf = _functions.texParameterf

/** Sets texture parameters. */
export const gl_texParameteri = _functions.texParameteri

/** Specifies all levels of two-dimensional texture storage. */
export const gl_texStorage2D = _functions.texStorage2D

/** Specifies all levels of a three-dimensional texture or two-dimensional array texture. */
export const gl_texStorage3D = _functions.texStorage3D

/** Updates a sub-rectangle of the current WebGLTexture. */
export const gl_texSubImage2D = _functions.texSubImage2D

/** Specifies a sub-rectangle of the current 3D texture. */
export const gl_texSubImage3D = _functions.texSubImage3D

/** Specifies values to record in WebGLTransformFeedback buffers. */
export const gl_transformFeedbackVaryings = _functions.transformFeedbackVaryings

/** Sets an uniform value in a shader program */
export const gl_uniform1f = _functions.uniform1f

/** Sets an uniform value in a shader program */
export const gl_uniform1fv = _functions.uniform1fv

/** Sets an uniform value in a shader program */
export const gl_uniform1i = _functions.uniform1i

/** Sets an uniform value in a shader program */
export const gl_uniform1iv = _functions.uniform1iv

/** Sets an uniform value in a shader program */
export const gl_uniform1ui = _functions.uniform1ui

/** Sets an uniform value in a shader program */
export const gl_uniform1uiv = _functions.uniform1uiv

/** Sets an uniform value in a shader program */
export const gl_uniform2f = _functions.uniform2f

/** Sets an uniform value in a shader program */
export const gl_uniform2fv = _functions.uniform2fv

/** Sets an uniform value in a shader program */
export const gl_uniform2i = _functions.uniform2i

/** Sets an uniform value in a shader program */
export const gl_uniform2iv = _functions.uniform2iv

/** Sets an uniform value in a shader program */
export const gl_uniform2ui = _functions.uniform2ui

/** Sets an uniform value in a shader program */
export const gl_uniform2uiv = _functions.uniform2uiv

/** Sets an uniform value in a shader program */
export const gl_uniform3f = _functions.uniform3f

/** Sets an uniform value in a shader program */
export const gl_uniform3fv = _functions.uniform3fv

/** Sets an uniform value in a shader program */
export const gl_uniform3i = _functions.uniform3i

/** Sets an uniform value in a shader program */
export const gl_uniform3iv = _functions.uniform3iv

/** Sets an uniform value in a shader program */
export const gl_uniform3ui = _functions.uniform3ui

/** Sets an uniform value in a shader program */
export const gl_uniform3uiv = _functions.uniform3uiv

/** Sets an uniform value in a shader program */
export const gl_uniform4f = _functions.uniform4f

/** Sets an uniform value in a shader program */
export const gl_uniform4fv = _functions.uniform4fv

/** Sets an uniform value in a shader program */
export const gl_uniform4i = _functions.uniform4i

/** Sets an uniform value in a shader program */
export const gl_uniform4iv = _functions.uniform4iv

/** Sets an uniform value in a shader program */
export const gl_uniform4ui = _functions.uniform4ui

/** Sets an uniform value in a shader program */
export const gl_uniform4uiv = _functions.uniform4uiv

/** Assigns binding points for active uniform blocks. */
export const gl_uniformBlockBinding = _functions.uniformBlockBinding

/** Sets an uniform value in a shader program */
export const gl_uniformMatrix2fv = _functions.uniformMatrix2fv

/** Sets an uniform value in a shader program */
export const gl_uniformMatrix2x3fv = _functions.uniformMatrix2x3fv

/** Sets an uniform value in a shader program */
export const gl_uniformMatrix2x4fv = _functions.uniformMatrix2x4fv

/** Sets an uniform value in a shader program */
export const gl_uniformMatrix3fv = _functions.uniformMatrix3fv

/** Sets an uniform value in a shader program */
export const gl_uniformMatrix3x2fv = _functions.uniformMatrix3x2fv

/** Sets an uniform value in a shader program */
export const gl_uniformMatrix3x4fv = _functions.uniformMatrix3x4fv

/** Sets an uniform value in a shader program */
export const gl_uniformMatrix4fv = _functions.uniformMatrix4fv

/** Sets an uniform value in a shader program */
export const gl_uniformMatrix4x2fv = _functions.uniformMatrix4x2fv

/** Sets an uniform value in a shader program */
export const gl_uniformMatrix4x3fv = _functions.uniformMatrix4x3fv

/** Uses the specified WebGLProgram as part the current rendering state. */
export const gl_useProgram = _functions.useProgram

/** Validates a WebGLProgram. */
export const gl_validateProgram = _functions.validateProgram

/** Sets a vertex attribute */
export const gl_vertexAttrib1f = _functions.vertexAttrib1f

/** Sets a vertex attribute */
export const gl_vertexAttrib1fv = _functions.vertexAttrib1fv

/** Sets a vertex attribute */
export const gl_vertexAttrib2f = _functions.vertexAttrib2f

/** Sets a vertex attribute */
export const gl_vertexAttrib2fv = _functions.vertexAttrib2fv

/** Sets a vertex attribute */
export const gl_vertexAttrib3f = _functions.vertexAttrib3f

/** Sets a vertex attribute */
export const gl_vertexAttrib3fv = _functions.vertexAttrib3fv

/** Sets a vertex attribute */
export const gl_vertexAttrib4f = _functions.vertexAttrib4f

/** Sets a vertex attribute */
export const gl_vertexAttrib4fv = _functions.vertexAttrib4fv

/** Modifies the rate at which generic vertex attributes advance when rendering multiple instances of primitives with gl_drawArraysInstanced() and gl_drawElementsInstanced(). */
export const gl_vertexAttribDivisor = _functions.vertexAttribDivisor

/** Sets a vertex attribute */
export const gl_vertexAttribI4i = _functions.vertexAttribI4i

/** Sets a vertex attribute */
export const gl_vertexAttribI4iv = _functions.vertexAttribI4iv

/** Sets a vertex attribute */
export const gl_vertexAttribI4ui = _functions.vertexAttribI4ui

/** Sets a vertex attribute */
export const gl_vertexAttribI4uiv = _functions.vertexAttribI4uiv

/** Specifies integer data formats and locations of vertex attributes in a vertex attributes array. */
export const gl_vertexAttribIPointer = _functions.vertexAttribIPointer

/** Specifies the data formats and locations of vertex attributes in a vertex attributes array. */
export const gl_vertexAttribPointer = _functions.vertexAttribPointer

/** Sets the viewport. */
export const gl_viewport = _functions.viewport

/** Returns immediately, but waits on the GL server until the given WebGLSync object is signaled. */
export const gl_waitSync = _functions.waitSync
